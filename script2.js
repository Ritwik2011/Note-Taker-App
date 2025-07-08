import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKjm4R8G6KxnIakoud5EM7mIxf2esXt8Y",
  authDomain: "note-taker-app-aa612.firebaseapp.com",
  projectId: "note-taker-app-aa612",
  storageBucket: "note-taker-app-aa612.appspot.com",
  messagingSenderId: "450633287631",
  appId: "1:450633287631:web:ea54b4b7c56b7377f8f4ba",
  measurementId: "G-2NH0614WC9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const notesList = document.getElementById("notes-list");
const noteInput = document.getElementById("note-input");
const noteTitle = document.getElementById("note-title");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-btn");
const newNoteBtn = document.getElementById("new-note-btn");
const logoutBtn = document.getElementById("logout-btn");
const message = document.getElementById("message");

let currentUser = null;
let currentNoteId = null;
let creatingNote = false;
let saveTimeout = null;

function showMessage(text, duration = 3000) {
  message.textContent = text;
  setTimeout(() => {
    message.textContent = "";
  }, duration);
}

function clearSelection() {
  Array.from(notesList.children).forEach((li) =>
    li.classList.remove("selected")
  );
}

function createNoteListItem(noteId, title, content) {
  const li = document.createElement("li");
  li.textContent = title || content.slice(0, 20) || "Untitled Note";
  li.dataset.id = noteId;
  li.addEventListener("click", () => loadNote(noteId, li));
  return li;
}

async function loadNote(noteId, listItem) {
  if (!noteId) return;
  const docRef = doc(db, "users", currentUser.uid, "notes", noteId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    clearSelection();
    listItem.classList.add("selected");
    currentNoteId = noteId;
    const data = docSnap.data();
    noteInput.value = data.content || "";
    noteTitle.value = data.title || "";
    saveBtn.disabled = false;
    deleteBtn.disabled = false;
  } else {
    showMessage("Note not found");
  }
}

async function loadNotesList() {
  notesList.innerHTML = "";
  const notesRef = collection(db, "users", currentUser.uid, "notes");
  const q = query(notesRef, orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    notesList.innerHTML = "";
    if (snapshot.empty) {
      noteInput.value = "";
      noteTitle.value = "";
      currentNoteId = null;
      saveBtn.disabled = true;
      deleteBtn.disabled = true;
      return;
    }
    snapshot.forEach((doc) => {
      const data = doc.data();
      const li = createNoteListItem(doc.id, data.title, data.content);
      notesList.appendChild(li);
    });
    if (!currentNoteId && notesList.firstChild) {
      loadNote(notesList.firstChild.dataset.id, notesList.firstChild);
    }
  });
}

async function saveNote() {
  try {
    if (!currentUser) return;
    const content = noteInput.value.trim();
    const title = noteTitle.value.trim();
    if (!title) {
      showMessage("Please add a title");
      return;
    }
    if (currentNoteId) {
      const noteRef = doc(db, "users", currentUser.uid, "notes", currentNoteId);
      await updateDoc(noteRef, { title, content, updatedAt: new Date() });
      showMessage("Note updated");
    } else {
      const notesRef = collection(db, "users", currentUser.uid, "notes");
      const docRef = await addDoc(notesRef, {
        title,
        content,
        createdAt: new Date(),
      });
      currentNoteId = docRef.id;
      showMessage("Note created");
      loadNotesList();
    }
  } catch {
    showMessage("Error saving note");
  }
}

async function deleteNote() {
  if (!currentUser || !currentNoteId) return;
  if (!confirm("Are you sure you want to delete this note?")) return;

  const noteRef = doc(db, "users", currentUser.uid, "notes", currentNoteId);
  await deleteDoc(noteRef);
  currentNoteId = null;
  noteInput.value = "";
  noteTitle.value = "";
  saveBtn.disabled = true;
  deleteBtn.disabled = true;
  showMessage("Note deleted");
  loadNotesList();
}

newNoteBtn.addEventListener("click", () => {
  clearSelection();
  currentNoteId = null;
  noteInput.value = "";
  noteTitle.value = "";
  saveBtn.disabled = false;
  deleteBtn.disabled = true;
});

saveBtn.addEventListener("click", saveNote);
deleteBtn.addEventListener("click", deleteNote);
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

noteTitle.addEventListener("input", () => {
  if (!currentUser) return;
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    if (!currentNoteId) {
      if (creatingNote) return;
      creatingNote = true;
      const notesRef = collection(db, "users", currentUser.uid, "notes");
      const docRef = await addDoc(notesRef, {
        title: noteTitle.value.trim() || "Untitled",
        content: noteInput.value.trim() || "",
        createdAt: new Date(),
      });
      currentNoteId = docRef.id;
      creatingNote = false;
      loadNotesList();
      saveBtn.disabled = false;
      deleteBtn.disabled = false;
    } else {
      const noteRef = doc(db, "users", currentUser.uid, "notes", currentNoteId);
      await updateDoc(noteRef, {
        title: noteTitle.value.trim(),
        updatedAt: new Date(),
      });
    }
  }, 500);
});

noteInput.addEventListener("input", () => {
  if (!currentUser) return;
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    if (!currentNoteId) {
      if (creatingNote) return;
      creatingNote = true;
      const notesRef = collection(db, "users", currentUser.uid, "notes");
      const docRef = await addDoc(notesRef, {
        title: noteTitle.value.trim() || "Untitled",
        content: noteInput.value.trim() || "",
        createdAt: new Date(),
      });
      currentNoteId = docRef.id;
      creatingNote = false;
      loadNotesList();
      saveBtn.disabled = false;
      deleteBtn.disabled = false;
    } else {
      const noteRef = doc(db, "users", currentUser.uid, "notes", currentNoteId);
      await updateDoc(noteRef, {
        content: noteInput.value.trim(),
        updatedAt: new Date(),
      });
    }
  }, 500);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loadNotesList();
  } else {
    window.location.href = "index.html";
  }
});