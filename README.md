# Image and Word — English Learning Flashcard & Widget Builder

Aplicativo interativo para estudo de vocabulário em língua inglesa e gerador de widgets HTML autocontidos, pronto para publicação no **GitHub** e **GitHub Pages** sem dependências externas de servidores ou fontes.

---

## 🚀 Funcionalidades Principais / Key Features

- **🎯 Flashcards Interativos com Feedback Imediato:** Prática de digitação e ortografia com verificação em tempo real, dicas progressivas e sistema de tolerância de respostas.
- **🔊 Áudio em MP3 & Síntese de Voz:** Suporte para URLs de áudio MP3 personalizadas, **incorporação direta do áudio em Base64 no HTML** para funcionamento 100% offline, e fallback automático para a Web Speech API (`en-US`).
- **🌐 100% Autocontido (Zero Dependências Externas):** Sem chamadas bloqueantes a Google Fonts ou CDNs externos. Utiliza fontes do sistema de alta legibilidade.
- **📦 Exportação de Arquivo Único (.html):** Baixe ou copie o código HTML compilado do widget para usar em qualquer lugar (Moodle, Canvas, WordPress, Notion, sites estáticos).
- **🎨 Temas Visuais & Idiomas:** Suporte a temas (Minimal Claro, Escuro Elegante, Papel Quente, Slate Moderno) e alternância de idioma (Português / Inglês).
- **⚙️ Opções de Cabeçalho:** Controle de exibição do título/instrução e do contador numérico de slides (`1 / 4`).

---

## 🛠️ Como Executar Localmente / Local Development

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18+ recomendada)
- `npm`

### 2. Instalação e Execução
```bash
# 1. Clonar o repositório
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git

# 2. Entrar na pasta do projeto
cd SEU-REPOSITORIO

# 3. Instalar dependências
npm install

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### 3. Compilação para Produção (Build)
```bash
npm run build
```
Os arquivos estáticos otimizados serão gerados na pasta `dist/` com caminhos relativos (`./assets/...`), prontos para serem hospedados em qualquer servidor estático ou GitHub Pages.

---

## 🌐 Publicação no GitHub e GitHub Pages

### Método Automático com GitHub Actions (Recomendado):

1. **Crie o repositório no GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit - Image and Word app"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```

2. **Ativar o GitHub Pages:**
   - No GitHub, acesse a aba **Settings** do seu repositório.
   - No menu lateral esquerdo, clique em **Pages**.
   - Na seção **Build and deployment** > **Source**, selecione **GitHub Actions**.
   - O workflow `.github/workflows/deploy.yml` incluído no projeto executará o build e publicará seu site automaticamente a cada commit na branch `main`.

---

## 📄 Licença
MIT License. Livre para uso pessoal, comercial e educacional.
