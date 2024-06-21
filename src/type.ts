
export interface userData {
  id:number;
  firstname: string;
  lastname: string;
  email: string;
  // Define other properties as needed


}
export interface User {
  firstname: string;
  lastname: string;
  email: string;
  // Define other properties as needed


}
export interface Make {
  id: number;
  make: string;
  isRareModel: number;
  isHighExposure: number;
  model:string;
  // Define other properties as needed


}
export interface Model {
  id: number;
  model: string;
  isHighExposure: null | boolean;
  isHighRisk: null | boolean;
  createdAt: string;
 
}
export interface Errors {
  otp?: (string | undefined)[]; // Adjust the type as needed
}

