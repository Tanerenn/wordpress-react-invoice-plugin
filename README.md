# 🧾 WordPress React Invoice Plugin

A modern, high-performance invoice generator plugin for WordPress, powered by **React** and **Vite**. This tool allows users to create professional invoices, manage history via LocalStorage, and download PDFs instantly without page reloads.

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20WordPress%20%7C%20Tailwind-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📸 Screenshots

| Dashboard & Editor | Settings & History |
|--------------------|--------------------|
 ![Settings Panel](./assets/preview-settings.png) |

### Generated PDF Output
![PDF Output](./assets/preview-pdf.png)

## 🌟 Key Features

* **⚡ React & WordPress Integration:** Seamlessly embedded into WordPress using shortcodes (`[fatura_araci]`).
* **📄 Real-time PDF Generation:** Uses `@react-pdf/renderer` to generate high-quality PDFs on the client side.
* **🎨 Theme & Customization:** Users can switch between color themes and currencies (TRY, USD, EUR, GBP).
* **💾 Smart History (LocalStorage):** Auto-saves current work and keeps a history of generated invoices. No database required.
* **📱 Fully Responsive:** Optimized for mobile and desktop screens using Tailwind CSS.
* **📦 Drag & Drop Logo:** Easy image upload for company logos.

## 🛠️ Tech Stack

* **Frontend:** React (Vite), Tailwind CSS
* **PDF Engine:** @react-pdf/renderer
* **CMS Integration:** PHP, WordPress Shortcode API, Enqueue API
* **Build Tool:** Vite (ES Modules)

## 🚀 Installation & Usage

### Method 1: For Users (Plugin Mode)
1.  Download the repository as a `.zip` file.
2.  Go to **WordPress Admin > Plugins > Add New > Upload Plugin**.
3.  Upload the zip file and click **Activate**.
4.  Create a new page and add the shortcode:
    ```
    [fatura_araci]
    ```
5.  Publish the page. Ensure the page template is set to **Full Width**.

### Method 2: For Developers (Source Code)
1.  Clone the repository:
    ```bash
    git clone https://github.com/Tanerenn/wordpress-react-invoice-plugin.git
    ```
2.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start development server:
    ```bash
    npm run dev
    ```
5.  To build for production:
    ```bash
    npm run build
    ```

**Developed by Taner Eren** *Full Stack Developer | React & WordPress Enthusiast*
