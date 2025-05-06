# Cena 3D Interativa com Three.js

## 📌 Acesso ao Projeto
**Link para visualização online:** [https://brenoscene.netlify.app/](https://brenoscene.netlify.app/)

## 🎯 Objetivo do Projeto
O objetivo deste projeto foi criar uma aplicação web interativa utilizando Three.js para visualizar e manipular uma cena 3D. A aplicação permite ao usuário interagir com diferentes objetos 3D (cubo, esfera e cilindro), alterando suas propriedades como cor, escala e textura, além de explorar a cena através de controles de câmera.

## 🔍 Visão Geral
Esta aplicação demonstra os conceitos fundamentais de gráficos 3D na web usando a biblioteca Three.js. Implementa uma variedade de funcionalidades, incluindo renderização 3D, iluminação, sombras, manipulação de câmera, seleção de objetos, transformações geométricas, aplicação de texturas e efeitos de pós-processamento.

## 🛠️ Tecnologias Utilizadas
- **Three.js**: Biblioteca JavaScript para criação de conteúdo 3D no navegador
- **HTML5 & CSS3**: Para estrutura e estilização da interface
- **JavaScript (ES6+)**: Para lógica e interatividade
- **Vite**: Ferramenta de build para desenvolvimento moderno

## ✨ Funcionalidades

### 1. Objetos 3D
- **Três objetos básicos**:
  - Cubo azul (BoxGeometry)
  - Esfera vermelha (SphereGeometry)
  - Cilindro verde (CylinderGeometry)
- Cada objeto possui materiais detalhados com propriedades físicas realistas (roughness, metalness)
- Geometrias de alta qualidade com segmentação adequada para superfícies suaves

### 2. Transformações Geométricas
- **Rotação automática**: Cada objeto pode girar independentemente
- **Escala ajustável**: Interface para ajustar o tamanho de cada objeto
- **Posicionamento**: Objetos distribuídos estrategicamente na cena

### 3. Iluminação
- **Luz ambiente**: Iluminação global suave e ajustável
- **Luz direcional**: Simula luz solar com intensidade e direção específicas
- **Sombras dinâmicas**: Alta qualidade (2048x2048 shadow map) com PCF Soft Shadows
- Configuração otimizada da câmera de sombra para evitar artefatos nas bordas

### 4. Texturas
- **Sistema de texturas**:
  - Textura de tijolo (Brick)
  - Textura de madeira (Wood)
- Implementação de normal maps para maior realismo e profundidade
- Mapeamento UV apropriado para cada geometria

### 5. Controles Interativos
- **Controles de câmera**:
  - Rotação orbital com mouse (OrbitControls)
  - Navegação WASD para movimentação da câmera em primeira pessoa
  - Zoom com roda do mouse
- **Seleção de objetos**:
  - Seleção por clique com raycasting
  - Interface visual indicando objeto selecionado
- **Painel de controle**:
  - Seleção de objetos por dropdown
  - Seletor de cores
  - Ajuste de escala
  - Seleção de texturas
  - Botões para resetar e controlar rotação

### 6. Efeitos de Pós-processamento
- **Efeito Bloom**: Brilho emissivo para destacar áreas claras
- **Efeito Outline**: Contorno para destacar objetos selecionados
- **EffectComposer**: Sistema de composição para combinação de múltiplos efeitos de renderização

### 7. Ambiente
- **Plano de fundo escuro**: Maximiza contraste e visibilidade
- **Grid de referência**: Ajuda na percepção de profundidade e distância
- **Plano de chão**: Superfície para receber sombras e fornecer contexto espacial

## 🎮 Guia de Uso
1. **Navegação pela cena**:
   - Clique e arraste com o botão esquerdo do mouse para orbitar a câmera
   - Use a roda do mouse para zoom in/out
   - Teclas WASD para mover a câmera em primeira pessoa
   - Clique e arraste com o botão direito para pan (deslocar visualização)

2. **Manipulação de objetos**:
   - Clique em um objeto para selecioná-lo
   - Use o painel à direita para modificar as propriedades do objeto selecionado
   - Altere a cor usando o seletor de cores
   - Ajuste a escala com o slider
   - Aplique diferentes texturas através do dropdown

3. **Controle de efeitos visuais**:
   - Ative/desative o efeito Bloom para adicionar brilho emissivo
   - Ative/desative o efeito de contorno para destacar objetos
   - Ajuste a intensidade da luz ambiente

     

[2025-05-06 18-10-12](https://github.com/user-attachments/assets/12b05c47-3e8a-49d0-9a27-ea812db28647)



## 🧠 Decisões de Modelagem

### Objetos Geométricos
- **BoxGeometry (10,10,10)**: Utilizei uma subdivisão aumentada para o cubo para obter melhor qualidade de iluminação e deformação ao aplicar texturas.
- **SphereGeometry (32,32)**: Alta segmentação para garantir superfície suave, especialmente importante para reflexos de luz.
- **CylinderGeometry**: Proporções escolhidas (0.5, 0.5, 1.5) para criar forma equilibrada com altura suficiente para destacar-se visualmente.

### Materiais
- **MeshStandardMaterial**: Escolhido por seu realismo físico com suporte a propriedades como roughness e metalness.
- **Parâmetros físicos personalizados**:
  - Cubo: Levemente metálico (0.2) com baixa rugosidade (0.3) para aparência semi-polida
  - Esfera: Muito lisa (rugosidade 0.1) e não metálica para aparência similar a plástico ou cerâmica polida
  - Cilindro: Rugosidade média (0.5) com leve metalicidade (0.1) para aparência semi-fosca

### Sistema de Iluminação
- **Combinação de luzes**: Luz ambiente + luz direcional para balancear iluminação global e sombras direcionais
- **Intensidade da luz ambiente**: 0.5 por padrão, ajustável para evitar áreas muito escuras sem eliminar sombras
- **Posicionamento da luz direcional**: Posicionada em (5,10,5) para criar sombras em ângulo natural, similar à luz solar matinal

### Configuração de Câmera
- **Campo de visão**: 75° para dar leve efeito de perspectiva sem distorção excessiva
- **Posição inicial**: Colocada em (0,2,5) para visualizar todos os objetos com perspectiva levemente elevada
- **Controles da câmera**: OrbitControls com damping para movimento suave e natural

### Efeitos de Pós-processamento
- **Bloom**: Configurado com strength 0.5, radius 0.4 e threshold 0.85 para efeito sutil que não domina a cena
- **Outline**: Configurado com edgeStrength 3.0 e edgeGlow 0.5 para contorno visível mas elegante

### Otimizações
- **Gerenciamento de renderização**: Usando EffectComposer para pipeline eficiente de renderização
- **Shadow mapping**: PCFSoftShadowMap para sombras com bordas suaves e realistas
- **Configuração de shadow camera**: Cuidadosamente ajustada para cobrir toda a cena sem desperdiçar resolução

## 🚀 Instalação e Execução Local

1. Clone o repositório:
   ```bash
   git clone https://github.com/brevsc/practical_project_threejs.git 
   ```
2. Acesse a pasta do repositório clonado:
   ```bash
   cd practical_project_threejs
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Abra no navegador:
   ```
   http://localhost:5173
   ```
