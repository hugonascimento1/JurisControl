// import React, { useState } from "react";
// import { Card, CardContent } from "../ui/card";
// import { RiWhatsappFill } from "react-icons/ri";
// import { HiOutlineMail } from "react-icons/hi";
// import justice from "../../../public/justice.png";
// import { motion } from "framer-motion";

// interface ProfileFormData {
//   username: string;
//   email: string;
//   descricao: string;
//   telefone: string;
//   assunto: string;
// }

// export function ProfileForm() {
//   const [formData, setFormData] = useState<ProfileFormData>({
//     username: "",
//     email: "",
//     descricao: "",
//     telefone: "",
//     assunto: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Dados do perfil enviados:", formData);
//     alert("Perfil enviado! Veja o console.");
//   };

//   const handleEmailClick = () => {
//     window.location.href = "mailto:seuemail@exemplo.com";
//   };

//   const handleWhatsappClick = () => {
//     window.open("https://wa.me/5599999999999", "_blank");
//   };

//   return (
//     <div className="flex flex-wrap justify-between items-start w-full max-w-[1500px] mx-auto h-auto bg-[#050550] shadow-md rounded-3xl border mb-20">
//       {/* Formulário - lado esquerdo */}
//       <form onSubmit={handleSubmit} className="w-full md:w-1/2 text-white p-10">
//         <h2 className="text-6xl font-bold mb-8">Entre em Contato</h2>

//         {/* Campos do formulário */}
//         {[
//           { id: "username", label: "Nome de usuário", type: "text" },
//           { id: "email", label: "E-mail", type: "email" },
//           { id: "telefone", label: "Telefone", type: "text" },
//           { id: "assunto", label: "Assunto", type: "text" },
//         ].map(({ id, label, type }) => (
//           <div key={id}>
//             <label className="block mb-2 font-semibold text-lg" htmlFor={id}>
//               {label}
//             </label>
//             <input
//               type={type}
//               id={id}
//               name={id}
//               value={formData[id as keyof ProfileFormData]}
//               onChange={handleChange}
//               placeholder={`Digite seu ${label.toLowerCase()}`}
//               className="w-full md:w-[80%] mb-4 p-2 border rounded text-black"
//               required
//             />
//           </div>
//         ))}

//         <label className="block mb-2 font-semibold text-lg" htmlFor="descricao">
//           Descrição
//         </label>
//         <textarea
//           id="descricao"
//           name="descricao"
//           value={formData.descricao}
//           onChange={handleChange}
//           placeholder="Conte um pouco sobre você"
//           className="w-full md:w-[80%] mb-4 p-2 border rounded resize-none text-black"
//           rows={4}
//         />

//         <div className="text-2xl font-bold">
//           <button
//             type="submit"
//             className="bg-white text-[#050550] mt-6 w-[200px] h-[60px] rounded hover:bg-[#9d9db1] transition"
//           >
//             Enviar
//           </button>
//         </div>
//       </form>

//       {/* Lado direito com imagem */}
//       <div
//         className="w-full h-[820px] md:w-1/2 relative flex items-center justify-center py-20 px-4 overflow-hidden rounded-r-3xl"
//         style={{
//           backgroundImage: `url(${justice.src})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div className="absolute inset-0 bg-[#050550]/70 backdrop-blur-sm z-0" />

//         {/* Botões com animação */}
//         <div className="relative z-10 flex flex-col gap-6 items-center justify-center w-full max-w-md">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={handleEmailClick}
//             className="w-full bg-[#ffffff57] text-[#050550] text-center rounded-xl py-8 px-4 shadow-md hover:bg-white transition"
//           >
//             <div className="flex flex-col items-center">
//               <HiOutlineMail className="w-20 h-20 mb-6" />
//               <span className="text-2xl font-bold">E-mail</span>
//             </div>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={handleWhatsappClick}
//             className="w-full bg-[#ffffff57] text-[#050550] text-center rounded-xl py-8 px-4 shadow-md hover:bg-white transition"
//           >
//             <div className="flex flex-col items-center">
//               <RiWhatsappFill className="w-20 h-20 mb-6" />
//               <span className="text-2xl font-bold">Whatsapp</span>
//             </div>
//           </motion.button>
//         </div>
//       </div>
//     </div>
//   );
// }
