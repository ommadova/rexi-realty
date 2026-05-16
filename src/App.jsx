import { useState } from "react";
import { Mail, MessageSquare, Phone, Send, User } from "lucide-react";

const initialFormState = {
  fullName: "",
  email: "",
  message: "",
};

const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

export default function App() {
  const [formData, setFormData] = useState(initialFormState);
  const [submitState, setSubmitState] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formspreeEndpoint) {
      setSubmitState("error");
      setStatusMessage(
        "Add your Formspree endpoint to VITE_FORMSPREE_ENDPOINT before submitting the form.",
      );
      return;
    }

    setSubmitState("submitting");
    setStatusMessage("");

    try {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          message: formData.message,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          result?.errors?.[0]?.message ||
          "Something went wrong while sending your request. Please try again.";

        throw new Error(errorMessage);
      }

      setSubmitState("success");
      setStatusMessage(
        "Request submitted successfully. Our team will get back to you shortly.",
      );
      setFormData(initialFormState);
    } catch (error) {
      setSubmitState("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while sending your request. Please try again.",
      );
    }
  }

  return (
    <main className="page-shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />

      <section className="contact-card">
        <div className="brand-panel">
          <div className="brand-panel__content">
            <div className="brand-logo-frame">
              <img
                className="brand-logo"
                src="/logo.jpg"
                alt="Rexi Realty logo"
              />
            </div>

            <div className="brand-copy">
              <p className="eyebrow">Client Request Portal</p>
              <p className="lead">
                Send us your request and our team will follow up promptly with
                the next best step.
              </p>
            </div>

            <div className="contact-list">
              <a className="contact-item" href="mailto:info@rexirealty.com">
                <span className="contact-icon">
                  <Mail size={20} />
                </span>
                <span>info@rexirealty.com</span>
              </a>
              <a className="contact-item" href="tel:+15551234567">
                <span className="contact-icon">
                  <Phone size={20} />
                </span>
                <span>+1 (555) 123-4567</span>
              </a>
            </div>
          </div>
        </div>

        <div className="form-panel">
          <div className="form-panel__content">
            <div className="form-header">
              <p className="eyebrow">Submit Your Request</p>
              <h2>Tell us what you need.</h2>
              <p>
                Fill out the form below and we&apos;ll be in touch soon with
                tailored guidance.
              </p>
            </div>

            <form className="request-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>Full Name</span>
                <div className="input-wrap">
                  <User size={18} />
                  <input
                    autoComplete="name"
                    name="fullName"
                    placeholder="John Doe"
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        fullName: event.target.value,
                      }))
                    }
                  />
                </div>
              </label>

              <label className="field">
                <span>Email Address</span>
                <div className="input-wrap">
                  <Mail size={18} />
                  <input
                    autoComplete="email"
                    name="email"
                    placeholder="john@example.com"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                  />
                </div>
              </label>

              <label className="field">
                <span>Your Request</span>
                <div className="input-wrap input-wrap--textarea">
                  <MessageSquare size={18} />
                  <textarea
                    name="message"
                    placeholder="Tell us how we can help you..."
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        message: event.target.value,
                      }))
                    }
                  />
                </div>
              </label>

              <button className="submit-button" type="submit" disabled={submitState === "submitting"}>
                <Send size={18} />
                <span>{submitState === "submitting" ? "Sending..." : "Submit"}</span>
              </button>

              <p
                className={`status-message status-message--${submitState}${submitState === "idle" ? "" : " status-message--visible"}`}
                role="status"
              >
                {statusMessage}
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
