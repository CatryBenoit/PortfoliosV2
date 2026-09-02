// ContactForm.styles.ts

export const CONTACT_STYLES = {
  // Conteneur centré absolu
  container: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-auto",
  
  // Fenêtre principale du formulaire
  panel: "w-[1200px] md:w-[1800px] p-8 border-2 border-cyan-400 bg-[#070b14] relative rounded-sm shadow-[0_0_40px_rgba(34,211,238,0.3)] animate-[slideIn_0.3s_ease-out]",  
  // Header
  header: "flex justify-between items-center mb-8 border-b-2 border-cyan-500/50 pb-4",
  headerSubtitle: "text-[10px] text-cyan-400 tracking-[0.3em] flex items-center gap-2 mb-1 font-bold",
  headerTitle: "text-white font-extrabold text-2xl uppercase tracking-tighter",
  closeBtn: "p-2 text-cyan-400 border border-cyan-500/30 transition-all hover:text-red-400 hover:bg-red-500/20 hover:rotate-90 cursor-pointer active:scale-90",

  // Écran de succès (Message envoyé)
  successScreen: "py-10 text-center animate-[slide_0.3s_ease-out]",
  successIcon: "text-cyan-400 mb-4 flex justify-center",
  successTitle: "text-white font-bold text-xl uppercase mb-2",
  successText: "text-cyan-200/70 text-sm tracking-widest",
  successCloseBtn: "mt-8 px-6 py-2 border-2 border-cyan-400 text-cyan-400 font-bold transition-all uppercase text-xs hover:bg-cyan-400 hover:text-white cursor-pointer hover:scale-105 active:scale-95",  
  // Formulaire et éléments de champs
  form: "space-y-6",
  fieldGroup: "relative group",
  fieldLabel: "text-[10px] text-cyan-400 uppercase tracking-widest mb-2 block font-bold",
  
  // Inputs en ligne (Nom, Email, Objet)
  inputUnderlineRow: "flex items-center border-b-2 border-slate-700 transition-all group-focus-within:border-cyan-400",
inputUnderlineField: `
bg-transparent
border-none
outline-none

text-white
caret-cyan-400

w-full
py-2
text-sm
font-medium
uppercase

placeholder:text-slate-500

autofill:bg-transparent
`,  fieldIcon: "text-slate-400 mr-3 group-focus-within:text-cyan-400",
  
  // Bloc Textarea (Message)
textareaBox: "flex items-start border-2 border-slate-700 p-3 transition-all bg-black/30 group-focus-within:border-cyan-400",
textareaField: `
bg-transparent
border-none
outline-none

text-white
caret-cyan-400

w-full
text-sm
font-medium
uppercase
resize-none

placeholder:text-slate-500
`,  textareaIcon: "text-slate-400 mr-3 mt-1 group-focus-within:text-cyan-400",
  
  // Bouton de soumission principal
  submitBtn: "w-full bg-cyan-500 py-3 mt-2 text-white font-white uppercase tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:bg-cyan-400 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,211,238,0.7)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
};