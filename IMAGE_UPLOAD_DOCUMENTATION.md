# Documentación de Subida de Imágenes

Esta documentación describe las opciones disponibles para la subida de imágenes en el sistema, tanto para usuarios como para productos.

## Índice

- [Imágenes de Usuario](#imágenes-de-usuario)
- [Imágenes de Producto](#imágenes-de-producto)
- [Implementación Técnica](#implementación-técnica)
- [Ejemplos de Uso](#ejemplos-de-uso)

---

## Imágenes de Usuario

Para la subida de imágenes de usuario, el sistema acepta dos tipos (`images_kind`):

### 1. `socialmedia`
Imágenes provenientes de redes sociales del usuario.

**Casos de uso:**
- Fotos de perfil de redes sociales
- Imágenes públicas del usuario en plataformas sociales
- Contenido visual para análisis de estilo personal

### 2. `reference`
Imágenes de referencia subidas directamente por el usuario.

**Casos de uso:**
- Fotos personales del usuario
- Imágenes de referencia de estilo
- Selfies o fotos del armario personal

---

## Imágenes de Producto

Para la subida de imágenes de productos, el sistema acepta tres tipos (`images_kind`):

### 1. `catalog`
Imágenes del catálogo oficial del producto.

**Casos de uso:**
- Fotos profesionales del producto
- Imágenes de catálogo comercial
- Fotografías de estudio del producto

### 2. `product`
Imágenes generales del producto.

**Casos de uso:**
- Fotos del producto en uso
- Imágenes adicionales del producto
- Vistas alternativas del producto

### 3. `background`
Imágenes de fondo para procesamiento con IA.

**Casos de uso:**
- Imágenes para eliminación de fondo
- Fotos del producto que requieren procesamiento
- Imágenes base para personalización con IA

### 4. `reference`
Imágenes de referencia del producto.

**Casos de uso:**
- Fotos de inspiración
- Referencias de estilo
- Imágenes de ejemplo para personalización

---

## Implementación Técnica

### API Endpoints

El sistema utiliza la API `airisLoaderApi` con los siguientes endpoints:

#### 1. Subir Imágenes de Usuario
```
POST /users/user-images
```

**Parámetros:**
- `user_id`: ID del usuario
- `images_kind`: Tipo de imagen (`socialmedia` | `reference`)
- `images`: Array de archivos de imagen

#### 2. Crear Producto con Imágenes
```
POST /products/products-with-images
```

**Parámetros:**
- `product_name`: Nombre del producto
- `product_description`: Descripción (opcional)
- `product_gender`: Género del producto
- `product_price`: Precio
- `product_rank`: Ranking (opcional, default: 0)
- `product_characteristics`: Array de características (opcional)
- `images_kind`: Tipo de imagen (`catalog` | `product` | `background` | `reference`)
- `images`: Array de archivos de imagen

#### 3. Añadir Imágenes a Producto Existente
```
POST /products/add-product-images
```

**Parámetros:**
- `product_id`: ID del producto
- `images_kind`: Tipo de imagen (`catalog` | `product` | `background` | `reference`)
- `images`: Array de archivos de imagen

---

## Ejemplos de Uso

### Ejemplo 1: Subir Imágenes de Usuario (Social Media)

```javascript
import { useUploadUserImagesMutation } from '../store/services/airisLoaderApi';

function UploadSocialMediaImages() {
  const [uploadImages, { isLoading, error }] = useUploadUserImagesMutation();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleUpload = async () => {
    try {
      await uploadImages({
        userId: 1,
        imagesKind: 'socialmedia',
        images: selectedFiles,
      }).unwrap();
      alert('Imágenes de redes sociales subidas con éxito!');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
      />
      <button onClick={handleUpload} disabled={isLoading}>
        Subir Imágenes de Redes Sociales
      </button>
    </div>
  );
}
```

### Ejemplo 2: Subir Imágenes de Usuario (Referencia)

```javascript
import { useUploadUserImagesMutation } from '../store/services/airisLoaderApi';

function UploadReferenceImages() {
  const [uploadImages, { isLoading, error }] = useUploadUserImagesMutation();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleUpload = async () => {
    try {
      await uploadImages({
        userId: 1,
        imagesKind: 'reference',
        images: selectedFiles,
      }).unwrap();
      alert('Imágenes de referencia subidas con éxito!');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
      />
      <button onClick={handleUpload} disabled={isLoading}>
        Subir Imágenes de Referencia
      </button>
    </div>
  );
}
```

### Ejemplo 3: Crear Producto con Imágenes de Catálogo

```javascript
import { useCreateProductWithImagesMutation } from '../store/services/airisLoaderApi';

function CreateProductWithCatalogImages() {
  const [createProduct, { isLoading, error }] = useCreateProductWithImagesMutation();
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productGender: 'unisex',
    productPrice: 0,
    images: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createProduct({
        ...formData,
        imagesKind: 'catalog',
      }).unwrap();
      alert('Producto creado con imágenes de catálogo!');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre del producto"
        value={formData.productName}
        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
      />
      <input
        type="number"
        placeholder="Precio"
        value={formData.productPrice}
        onChange={(e) => setFormData({ ...formData, productPrice: parseFloat(e.target.value) })}
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files) })}
      />
      <button type="submit" disabled={isLoading}>
        Crear Producto con Catálogo
      </button>
    </form>
  );
}
```

### Ejemplo 4: Añadir Imágenes de Fondo a Producto Existente

```javascript
import { useAddProductImagesMutation } from '../store/services/airisLoaderApi';

function AddBackgroundImages({ productId }) {
  const [addImages, { isLoading, error }] = useAddProductImagesMutation();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleUpload = async () => {
    try {
      await addImages({
        productId,
        imagesKind: 'background',
        images: selectedFiles,
      }).unwrap();
      alert('Imágenes de fondo añadidas con éxito!');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
      />
      <button onClick={handleUpload} disabled={isLoading}>
        Añadir Imágenes de Fondo
      </button>
    </div>
  );
}
```

### Ejemplo 5: Añadir Imágenes de Producto

```javascript
import { useAddProductImagesMutation } from '../store/services/airisLoaderApi';

function AddProductImages({ productId }) {
  const [addImages, { isLoading, error }] = useAddProductImagesMutation();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleUpload = async () => {
    try {
      await addImages({
        productId,
        imagesKind: 'product',
        images: selectedFiles,
      }).unwrap();
      alert('Imágenes de producto añadidas con éxito!');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
      />
      <button onClick={handleUpload} disabled={isLoading}>
        Añadir Imágenes de Producto
      </button>
    </div>
  );
}
```

### Ejemplo 6: Añadir Imágenes de Referencia a Producto

```javascript
import { useAddProductImagesMutation } from '../store/services/airisLoaderApi';

function AddReferenceImages({ productId }) {
  const [addImages, { isLoading, error }] = useAddProductImagesMutation();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleUpload = async () => {
    try {
      await addImages({
        productId,
        imagesKind: 'reference',
        images: selectedFiles,
      }).unwrap();
      alert('Imágenes de referencia añadidas con éxito!');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
      />
      <button onClick={handleUpload} disabled={isLoading}>
        Añadir Imágenes de Referencia
      </button>
    </div>
  );
}
```

---

## Resumen de Tipos de Imagen

### Para Usuarios

| Tipo | Valor `images_kind` | Descripción |
|------|---------------------|-------------|
| Redes Sociales | `socialmedia` | Imágenes de redes sociales del usuario |
| Referencia | `reference` | Imágenes de referencia personales |

### Para Productos

| Tipo | Valor `images_kind` | Descripción |
|------|---------------------|-------------|
| Catálogo | `catalog` | Imágenes profesionales de catálogo |
| Producto | `product` | Imágenes generales del producto |
| Fondo | `background` | Imágenes para procesamiento con IA |
| Referencia | `reference` | Imágenes de referencia del producto |

---

## Notas Importantes

> [!IMPORTANT]
> - Todos los endpoints aceptan múltiples imágenes simultáneamente
> - Los archivos deben ser de tipo imagen (`image/*`)
> - El parámetro `images_kind` es obligatorio en todas las peticiones
> - Las imágenes se envían mediante `FormData` con el campo `images`

> [!TIP]
> - Usa `socialmedia` para imágenes públicas del usuario
> - Usa `reference` para imágenes privadas o de referencia
> - Usa `catalog` para imágenes profesionales de productos
> - Usa `background` cuando necesites procesamiento con IA

> [!WARNING]
> - Asegúrate de validar el tipo de archivo antes de subir
> - Verifica que el usuario esté autenticado antes de permitir subidas
> - Maneja adecuadamente los errores de red y tamaño de archivo

---

## Referencias

- [airisLoaderApi.js](file:///Users/alejandro/dev/POC/src/store/services/airisLoaderApi.js) - Implementación de la API
- [RTKQueryExamples.jsx](file:///Users/alejandro/dev/POC/src/examples/RTKQueryExamples.jsx) - Ejemplos de uso completos
