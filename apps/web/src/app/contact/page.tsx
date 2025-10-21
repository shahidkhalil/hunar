"use client";

import { useState } from "react";
import { Button } from "@hunar/ui";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send to API
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-brown mb-6 text-center">
          Get in Touch
        </h1>
        <p className="text-xl text-charcoal/80 text-center mb-12">
          Have a question or want to learn more about our products? We'd love to hear from you.
        </p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <p className="text-green-800 font-medium">
              Thank you for your message! We'll get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-charcoal mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl border border-brown/20 focus:border-brown focus:outline-none focus:ring-2 focus:ring-brown/20"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-charcoal mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl border border-brown/20 focus:border-brown focus:outline-none focus:ring-2 focus:ring-brown/20"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-charcoal mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl border border-brown/20 focus:border-brown focus:outline-none focus:ring-2 focus:ring-brown/20"
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Send Message
            </Button>
          </form>
        )}

        <div className="mt-12 pt-12 border-t border-brown/10">
          <h2 className="font-serif text-2xl font-bold text-brown mb-6 text-center">
            Other Ways to Reach Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">Email</h3>
              <p className="text-charcoal/70 text-sm">contact@hunar.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">Phone</h3>
              <p className="text-charcoal/70 text-sm">+1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">Hours</h3>
              <p className="text-charcoal/70 text-sm">Mon-Fri, 9am-5pm EST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

