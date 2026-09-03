"use client";
import { useState } from "react";
import { X, Send, User, Mail, MessageSquare, Satellite, Tag } from "lucide-react";
import { CONTACT_STYLES as S } from "./ContactForm.styles"; 

export default function ContactForm({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          subject: "Portfolio : " + formData.subject || "Nouveau message depuis le Portfolio",
          message: "Portfolio : " + formData.subject + "\n" + formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("sent");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        console.error("Erreur de transmission:", result);
        setStatus("idle");
        alert("Échec de la transmission. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      setStatus("idle");
      alert("La liaison réseau a échoué. Vérifiez votre connexion.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={S.container}>
      <div className={S.panel}>
        
        {/* HEADER */}
        <div className={S.header}>
          <div>
            <div className={S.headerSubtitle}>
              <Satellite size={14} className="animate-pulse" /> 
              <span>ESTABLISHING_UPLINK</span>
            </div>
            <h2 className={S.headerTitle}>Contact</h2>
          </div>
          <button onClick={onClose} className={S.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* ÉCRAN DE SUCCÈS OU FORMULAIRE */}
        {status === "sent" ? (
          <div className={S.successScreen}>
            <div className={S.successIcon}><Send size={48} /></div>
            <h3 className={S.successTitle}>Message_Transmis</h3>
            <p className={S.successText}>Signal relayé avec succès vers la base.</p>
            <button onClick={onClose} className={S.successCloseBtn}>
              Fermer_Canal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={S.form}>
            
            {/* NOM */}
            <div className={S.fieldGroup}>
              <label className={S.fieldLabel}>Identification</label>
              <div className={S.inputUnderlineRow}>
                <User size={16} className={S.fieldIcon} />
                <input 
                style={{ color: "white" }}
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="VOTRE_IDENTITE"
                  required
                  className={S.inputUnderlineField}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className={S.fieldGroup}>
              <label className={S.fieldLabel}>Canal_Com (Email)</label>
              <div className={S.inputUnderlineRow}>
                <Mail size={16} className={S.fieldIcon} />
                <input 
style={{ color: "white" }}
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ADRESSE@RESEAU.COM"
                  required
                  className={S.inputUnderlineField}
                />
              </div>
            </div>

            {/* OBJET / SUJET */}
            <div className={S.fieldGroup}>
              <label className={S.fieldLabel}>Objet_Transmission</label>
              <div className={S.inputUnderlineRow}>
                <Tag size={16} className={S.fieldIcon} />
                <input 
                style={{ color: "white" }}
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="MOTIF DE CONTACT (EX: OFFRE D'EMPLOI)"
                  required
                  className={S.inputUnderlineField}
                />
              </div>
            </div>

            {/* MESSAGE */}
            <div className={S.fieldGroup}>
              <label className={S.fieldLabel}>Data_Payload</label>
              <div className={S.textareaBox}>
                <MessageSquare size={16} className={S.textareaIcon} />
                <textarea 
                style={{ color: "white" }}
                  rows={3}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="ENTREZ VOTRE MESSAGE ICI..."
                  required
                  className={S.textareaField}
                />
              </div>
            </div>

            {/* BOUTON D'ENVOI */}
            <button type="submit" disabled={status === "sending"} className={S.submitBtn}>
              {status === "sending" ? "TRANSMISSION..." : (
                <>
                  <Send size={18} />
                  Envoyer
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}