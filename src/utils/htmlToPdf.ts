import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface HTMLToPDFOptions {
  filename?: string;
  quality?: number;
  scale?: number;
  backgroundColor?: string;
  margin?: number;
}

export const convertHTMLToPDF = async (
  elementId: string, 
  options: HTMLToPDFOptions = {}
): Promise<void> => {
  const {
    filename = 'portfolio-summary.pdf',
    quality = 1,
    scale = 2,
    backgroundColor = '#ffffff',
    margin = 10
  } = options;

  try {
    // Get the HTML element
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    console.log('Converting HTML element to PDF:', element);

    // Convert HTML to canvas with high quality
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: backgroundColor,
      logging: true,
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    console.log('Canvas created:', canvas);

    // Get canvas dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calculate PDF dimensions (A4 size)
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = (imgHeight * pdfWidth) / imgWidth; // Maintain aspect ratio

    // Create PDF
    const pdf = new jsPDF({
      orientation: pdfHeight > 297 ? 'portrait' : 'portrait', // A4 height is 297mm
      unit: 'mm',
      format: 'a4'
    });

    // If content is taller than A4, we'll need multiple pages
    const pageHeight = 297; // A4 height
    let heightLeft = pdfHeight;
    let position = 0;

    // Add first page
    pdf.addImage(
      canvas.toDataURL('image/png', quality),
      'PNG',
      margin,
      margin,
      pdfWidth - (margin * 2),
      pdfHeight
    );

    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL('image/png', quality),
        'PNG',
        margin,
        position,
        pdfWidth - (margin * 2),
        pdfHeight
      );
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(filename);
    
    console.log('PDF saved successfully:', filename);
  } catch (error) {
    console.error('Error converting HTML to PDF:', error);
    throw new Error('Failed to convert HTML to PDF');
  }
};

export const convertElementToPDF = async (
  element: HTMLElement,
  options: HTMLToPDFOptions = {}
): Promise<void> => {
  const {
    filename = 'portfolio-summary.pdf',
    quality = 1,
    scale = 2,
    backgroundColor = '#ffffff',
    margin = 10
  } = options;

  try {
    console.log('Converting element to PDF:', element);

    // Wait for all images to load before converting
    const images = element.querySelectorAll('img');
    const imagePromises = Array.from(images).map((img) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve(img);
        } else {
          img.onload = () => resolve(img);
          img.onerror = () => {
            console.warn('Image failed to load:', img.src);
            resolve(img); // Resolve even if image fails to load
          };
        }
      });
    });

    // Wait for all images to load (or fail to load)
    console.log(`Waiting for ${imagePromises.length} images to load...`);
    await Promise.all(imagePromises);
    console.log('All images loaded (or failed to load)');

    // Convert HTML to canvas with high quality
    const canvas = await html2canvas(element, {
      scale: 2, // Use fixed scale for html2canvas
      useCORS: true,
      allowTaint: true,
      backgroundColor: backgroundColor,
      logging: false, // Disable logging for cleaner output
      imageTimeout: 15000, // 15 second timeout for images
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    console.log('Canvas created:', canvas);

    // Get canvas dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;
    const usableWidth = a4Width - (margin * 2);
    const usableHeight = a4Height - (margin * 2);

    // Calculate scaling to fit content width
    const scale = usableWidth / imgWidth;
    const scaledHeight = imgHeight * scale;

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/png', quality);

    // Calculate how many pages we need
    const pagesNeeded = Math.ceil(scaledHeight / usableHeight);
    
    console.log(`Canvas: ${imgWidth}x${imgHeight}, Scaled height: ${scaledHeight}mm, Pages needed: ${pagesNeeded}`);

    // Add content to PDF with proper pagination
    let heightLeft = scaledHeight;
    let position = 0;

    // Add first page
    pdf.addImage(
      imgData,
      'PNG',
      margin,
      margin,
      usableWidth,
      scaledHeight
    );

    heightLeft -= usableHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - scaledHeight + usableHeight;
      pdf.addPage();
      pdf.addImage(
        imgData,
        'PNG',
        margin,
        position,
        usableWidth,
        scaledHeight
      );
      heightLeft -= usableHeight;
    }

    // Save the PDF
    pdf.save(filename);
    
    console.log('PDF saved successfully:', filename);
  } catch (error) {
    console.error('Error converting element to PDF:', error);
    throw new Error('Failed to convert element to PDF');
  }
};
