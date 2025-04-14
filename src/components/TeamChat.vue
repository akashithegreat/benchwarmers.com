<template>
    <div class="mt-12 p-4 bg-gray-900 rounded-lg shadow max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-4 text-left">💬 Live Chat</h2>
  
      <div class="h-64 overflow-y-auto mb-4 space-y-3 border border-gray-700 p-3 rounded">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="bg-gray-800 p-2 rounded"
        >
          <span class="font-semibold text-green-400">{{ msg.name }}:</span>
          <span class="ml-1 text-white">{{ msg.text }}</span>
        </div>
      </div>
  
      <div class="flex">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type a message..."
          class="flex-1 p-2 bg-black border border-gray-600 rounded-l text-white"
        />
        <button
          @click="sendMessage"
          class="bg-green-600 px-4 rounded-r hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { auth, db } from '../firebase'
  import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore'
  import { Timestamp } from 'firebase/firestore'
  const props = defineProps({
    teamName: String
  })
  
  const newMessage = ref('')
  const messages = ref([])
  
  const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  const user = auth.currentUser
  if (!user) return alert('Please log in to chat.')

  try {
    await addDoc(collection(db, 'teamChats', props.teamName, 'messages'), {
      text: newMessage.value.trim(),
      name: user.displayName || 'Anonymous',
      createdAt: serverTimestamp()
    })
    newMessage.value = ''
  } catch (err) {
    console.error('❌ Failed to send message:', err)
  }
}
  
import { watch } from 'vue'

let unsubscribe = null

const setupChatListener = (teamName) => {
  if (unsubscribe) unsubscribe() // clean old listener

  const q = query(
    collection(db, 'teamChats', teamName, 'messages'),
    orderBy('createdAt')
  )

  unsubscribe = onSnapshot(q, (snapshot) => {
    messages.value = snapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date()
    }))
  })
}

watch(
  () => props.teamName,
  (newTeam) => {
    console.log('🔄 Switching chat to:', newTeam)
    setupChatListener(newTeam)
  },
  { immediate: true }
)

  </script>
