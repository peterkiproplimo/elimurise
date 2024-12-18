import React, { useState, useRef } from "react";
import * as yup from "yup";
import FooterComponent from "../../webapp/footer";
import NavbarMenu from "../../webapp/NavBarMenu";



const Terms = () => {
  const schema = yup
    .object({
      email: yup.string().required().email(),
      password: yup.string().required().min(4),
    })
    .required();
  const [loading, isLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="homeContainer sm:p-5 xl:p-0">
     <NavbarMenu/>

        <div className="xl:mx-auto xl:w-[80%] p-5">
        <h1 className="xl:text-3xl text-2xl  text-center font-semibold   w-full">
        TERMS OF USE
              </h1>
        <h1 className="xl:text-5xl text-2xl mt-5 text-center font-semibold  text-primary w-full">
        Hero Learning
              </h1>
           
                 <div className="xl:p-10  p-5">
        
              <h1 className="xl:text-3xl text-xl font-semibold text-primary w-full">
              1.Introduction
              </h1>
              <div className="mt-2  xl:text-2xl">
            <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, ex nec venenatis condimentum, lacus libero viverra purus, a interdum lacus mauris ac eros. 
                Nulla ac semper ligula, sed fringilla lacus. Vivamus hendrerit felis a lacus vestibulum, non euismod enim faucibus</p>
             
              </div>
            
           
           
        
        <h1 className="xl:text-3xl mt-8 text-xl font-semibold text-primary w-full">
        2. Acceptance of Terms
        </h1>
        <div className="mt-2 xl:text-2xl">
      <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, ex nec venenatis condimentum, lacus libero viverra purus, a interdum lacus mauris ac eros. 
          Nulla ac semper ligula, sed fringilla lacus. Vivamus hendrerit felis a lacus vestibulum, non euismod enim faucibus</p>
        </div>
      </div>
  
      <div className="xl:p-10  p-2">
        
        <h1 className="xl:text-3xl text-xl font-semibold text-primary w-full">
        3. Registration and Account Security
        </h1>
        <div className="mt-2 xl:text-2xl">
      <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, ex nec venenatis condimentum, lacus libero viverra purus, a interdum lacus mauris ac eros. 
          Nulla ac semper ligula, sed fringilla lacus. Vivamus hendrerit felis a lacus vestibulum, non euismod enim faucibus</p>
        </div>
      
      </div>




        
        </div>
        
      <FooterComponent/>


            </div>
    </>
  );
};

export default Terms;
