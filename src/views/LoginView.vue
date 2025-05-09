<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">Iniciar sesión</h2>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="tu@email.com"
          >
        </div>
        
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
          >
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading">Cargando...</span>
          <span v-else>Ingresar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { login, error, loading } = useAuth()

const form = reactive({
  email: 'test.user1@prolibu.com',
  password: 'Prolibu2025!'
})

const handleSubmit = async () => {
  await login({
    email: form.email,
    password: form.password
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: #f0f2f5;
}

.login-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.login-title {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #555;
}

.login-btn {
  background-color: #6e45e2;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background-color: #5d3ac7;
}

.login-btn:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  padding: 0.5rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 4px;
}

.dark-mode .login-card {
  background: #1e1e1e;
}

.dark-mode .login-title {
  color: #e0e0e0;
}

.dark-mode .form-group label {
  color: #b0b0b0;
}
</style>