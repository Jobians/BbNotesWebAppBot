/*CMD
  command: index.html
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BB Notes</title>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
      integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap");

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Roboto", sans-serif;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        user-select: none;
        background: #000;
        color: white;
        padding: 20px;
        padding-top: 100px;
        transition: transform 0.3s ease-out;
      }

      .header {
        position: fixed;
        width: 100%;
        background: #000;
        font-size: 28px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5px;
        margin-top: 25px;
      }

      .header span {
        font-size: 14px;
        color: gray;
      }

      .notes-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 12px;
        margin-top: 140px;
      }

      .note {
        background: #222;
        border-radius: 12px;
        padding: 12px;
        transition: transform 0.2s ease-in-out;
        animation: slideUp 0.3s ease-in-out;
      }

      .note:hover {
        transform: scale(1.05);
      }

      .note h3 {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 4px;
      }

      .note p {
        font-size: 12px;
        color: #bbb;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
      }

      .note .time {
        font-size: 10px;
        color: gray;
        margin-top: 8px;
      }

      .fab {
        position: fixed;
        bottom: 40px;
        right: 20px;
        width: 56px;
        height: 56px;
        background: #ffc107;
        color: black;
        font-size: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease-in-out;
      }

      .fab:hover {
        transform: scale(1.1);
      }

      .fab:active {
        transform: scale(0.9);
      }

      .popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        color: white;
        display: none;
        flex-direction: column;
        align-items: flex-start;
        padding: 20px;
        padding-top: 100px;
        overflow-y: auto;
        animation: fadeIn 0.3s ease-in-out;
      }

      .popup-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 10px;
      }

      .popup-header .back-btn {
        font-size: 24px;
      }

      .popup-meta {
        font-size: 12px;
        color: gray;
        margin-bottom: 15px;
      }

      .popup-title,
      .popup-content {
        width: 100%;
        background: none;
        border: none;
        color: white;
        outline: none;
      }

      .popup-title {
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 8px;
      }

      .popup-content {
        font-size: 16px;
        line-height: 1.5;
        height: 60vh;
        resize: none;
      }

      .popup-actions {
        display: flex;
        gap: 20px;
      }

      .btn {
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }

      .save-btn {
        background: #28a745;
        color: white;
      }

      .delete-btn {
        background: red;
        color: white;
      }

      .hidden {
        display: none !important;
      }

      .no-notes {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 80vh;
        text-align: center;
        opacity: 0.7;
      }

      .no-notes img {
        max-width: 200px;
        max-height: 200px;
      }

      .no-notes p {
        color: gray;
        margin-top: 10px;
        font-size: 16px;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
    <script src="https://telegram.org/js/telegram-web-app.js?1"></script>
    <script>
      window.Telegram.WebApp.ready();
      const webApp = Telegram.WebApp;

      try {
        webApp.requestFullscreen();
      } catch {}

      let currentNoteIndex = null;

      document.addEventListener("DOMContentLoaded", () => {
        renderNotes();

        document.getElementById("deleteNoteBtn").addEventListener("click", () => {
          if (currentNoteIndex !== null) {
            deleteNote(currentNoteIndex);
          }
        });
      });

      function openPopup(index = null) {
        const popup = document.getElementById("popup");
        const titleInput = document.getElementById("popupTitle");
        const contentInput = document.getElementById("popupContent");
        const meta = document.getElementById("popupMeta");
        const deleteBtn = document.getElementById("deleteNoteBtn");
        let notes = JSON.parse(localStorage.getItem("notes")) || [];

        currentNoteIndex = index;
        if (index !== null) {
          titleInput.value = notes[index].title;
          contentInput.value = notes[index].content;
          meta.textContent = notes[index].timestamp;
          deleteBtn.classList.remove("hidden");
        } else {
          titleInput.value = "";
          contentInput.value = "";
          meta.textContent = new Date().toLocaleString();
          deleteBtn.classList.add("hidden");
        }
        popup.style.display = "flex";
      }

      function closePopup() {
        document.getElementById("popup").style.display = "none";
      }

      function saveNote() {
        const title = document.getElementById("popupTitle").value.trim();
        const content = document.getElementById("popupContent").value.trim();
        if (!title || !content) return;

        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        const timestamp = new Date().toLocaleString();

        currentNoteIndex !== null ? (notes[currentNoteIndex] = { title, content, timestamp }) : notes.unshift({ title, content, timestamp });

        localStorage.setItem("notes", JSON.stringify(notes));
        closePopup();
        renderNotes();
      }

      function deleteNote(index) {
        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        closePopup();
        renderNotes();
      }

      function formatTime(timestamp) {
        const now = new Date();
        const noteTime = new Date(timestamp);
        const diffMs = now - noteTime;
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMinutes < 1) return "Just now";
        if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;

        return noteTime.toLocaleDateString();
      }

      function renderNotes() {
        const notesContainer = document.getElementById("notesContainer");
        const noNotesContainer = document.getElementById("noNotesContainer");
        let notes = JSON.parse(localStorage.getItem("notes")) || [];

        if (notes.length === 0) {
          noNotesContainer.classList.remove("hidden");
          notesContainer.classList.add("hidden");
        } else {
          noNotesContainer.classList.add("hidden");
          notesContainer.classList.remove("hidden");
        }

        notesContainer.innerHTML = "";

        notes.forEach((note, index) => {
          let noteElement = document.createElement("div");
          noteElement.classList.add("note");
          noteElement.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p><div class="time">${formatTime(note.timestamp)}</div>`;
          noteElement.onclick = () => openPopup(index);
          notesContainer.appendChild(noteElement);
        });

        document.getElementById("note-count").innerText = `${notes.length} notes`;
      }
    </script>
  </head>
  <body>
    <div class="header">
      <div>
        <h1>BB Notes</h1>
        <span id="note-count">0 notes</span>
      </div>
    </div>

    <div class="no-notes hidden" id="noNotesContainer">
      <img src="https://media-hosting.imagekit.io//ba9a29d99c464ef2/download.svg?Expires=1835774853&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=yRf6jLNE0Rf6DnFPkHqCDokPEwtsl7aUrFCDHPp1SFZpgf1lyKASaSw-YQj0dShT58kgGSGYOZ1hfmwq0WRoNl~RKw3p6hMhTi5Q5f6nj0uzlQhowtt2K4jmfYcij4-hL3vAoYM2YjBeJw9WIX3e7iZCyk8qM-FOZYzNNT1vdZV5wJ3k4HlFhsv--ine387OE2yXAw7bXY7IRCWBaYR54PImPGc~Q82Szsk-eg9P5tspQxXXdMeYIldjuNzl4ahY6CvCMA~eWESIXPuKGhN4Z4sjDne-uEQgEegUOB9O~pCI2lSva0Kd3jh69M6LV4WWZsk7BYryzutJ5h~yc8zeKQ__" alt="No notes" />
      <p>No notes yet. Add one!</p>
    </div>

    <div class="notes-container" id="notesContainer"></div>

    <div class="fab" onclick="openPopup()">
      <i class="fa fa-plus"></i>
    </div>

    <div class="popup" id="popup">
      <div class="popup-header">
        <span class="back-btn" onclick="closePopup()">
          <i class="fa fa-arrow-left"></i>
        </span>
        <div class="popup-actions">
          <i class="fa-solid fa-floppy-disk" onclick="saveNote()"></i>
          <i class="fa fa-trash hidden" id="deleteNoteBtn"></i>
        </div>
      </div>
      <div class="popup-meta" id="popupMeta"></div>
      <input type="text" id="popupTitle" class="popup-title" placeholder="Title" />
      <textarea id="popupContent" class="popup-content" placeholder="Write your note..."></textarea>
    </div>
  </body>
</html>

