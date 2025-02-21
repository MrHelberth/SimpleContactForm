// Contact Form Manager Class
class ContactFormManager {
  constructor() {
    // Initialize DOM elements
    this.form = document.getElementById("contactForm");
    this.successAlert = document.getElementById("successAlert");
    this.errorAlert = document.getElementById("errorAlert");
    this.messagesContainer = document.getElementById("messagesContainer");

    // Input validation configuration
    this.validationConfig = {
      name: {
        element: document.getElementById("name"),
        errorElement: document.getElementById("nameError"),
        validate: (value) => value.trim().length >= 2,
      },
      email: {
        element: document.getElementById("email"),
        errorElement: document.getElementById("emailError"),
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      },
      message: {
        element: document.getElementById("message"),
        errorElement: document.getElementById("messageError"),
        validate: (value) => value.trim().length >= 10,
      },
    };

    // Bind event listeners
    this.initializeEventListeners();

    // Load existing messages
    this.loadMessages();
  }

  // Initialize all event listeners
  initializeEventListeners() {
    // Form submission
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Real-time validation
    Object.keys(this.validationConfig).forEach((field) => {
      const config = this.validationConfig[field];
      config.element.addEventListener("input", () => this.validateField(field));
    });
  }

  // Hide all alerts
  hideAlerts() {
    this.successAlert.style.display = "none";
    this.errorAlert.style.display = "none";
  }

  // Show specific alert
  showAlert(element, duration = 3000) {
    element.style.display = "block";
    setTimeout(() => {
      element.style.display = "none";
    }, duration);
  }

  // Validate single field
  validateField(field) {
    const config = this.validationConfig[field];
    const isValid = config.validate(config.element.value);

    config.errorElement.style.display = isValid ? "none" : "block";
    config.element.style.borderColor = isValid
      ? "var(--border)"
      : "var(--error)";

    return isValid;
  }

  // Handle form submission
  async handleSubmit(e) {
    e.preventDefault();
    this.hideAlerts();

    // Validate all fields
    const isValid = Object.keys(this.validationConfig)
      .map((field) => this.validateField(field))
      .every(Boolean);

    if (!isValid) {
      this.showAlert(this.errorAlert);
      return;
    }

    try {
      // Get form data
      const formData = {
        name: this.validationConfig.name.element.value,
        email: this.validationConfig.email.element.value,
        message: this.validationConfig.message.element.value,
        date: new Date().toISOString(),
      };

      // Save message
      this.saveMessage(formData);

      // Show success message and reset form
      this.showAlert(this.successAlert);
      this.form.reset();

      // Reset validation styles
      Object.keys(this.validationConfig).forEach((field) => {
        const config = this.validationConfig[field];
        config.element.style.borderColor = "var(--border)";
        config.errorElement.style.display = "none";
      });

      // Reload messages
      this.loadMessages();
    } catch (error) {
      console.error("Error saving message:", error);
      this.showAlert(this.errorAlert);
    }
  }

  // Save message to localStorage
  saveMessage(messageData) {
    const messages = this.getMessages();
    messages.push(messageData);
    localStorage.setItem("contactMessages", JSON.stringify(messages));
  }

  // Get messages from localStorage
  getMessages() {
    const messages = localStorage.getItem("contactMessages");
    return messages ? JSON.parse(messages) : [];
  }

  // Delete message
  deleteMessage(index) {
    const messages = this.getMessages();
    messages.splice(index, 1);
    localStorage.setItem("contactMessages", JSON.stringify(messages));
    this.loadMessages();
  }

  // Format date for display
  formatDate(dateString) {
    return new Date(dateString).toLocaleString();
  }

  // Load and display messages
  loadMessages() {
    const messages = this.getMessages();
    this.messagesContainer.innerHTML =
      messages.length === 0
        ? "<p>No messages yet</p>"
        : messages
            .map(
              (message, index) => `
                <div class="message-card">
                    <div class="message-header">
                        <span class="message-sender">${message.name}</span>
                        <button class="delete-btn" onclick="contactForm.deleteMessage(${index})">Delete</button>
                    </div>
                    <div class="message-date">${this.formatDate(
                      message.date
                    )}</div>
                    <div class="message-content">${message.message}</div>
                    <div class="message-content">${message.email}</div>
                </div>
            `
            )
            .join("");
  }
}

// Initialize the contact form manager
const contactForm = new ContactFormManager();
