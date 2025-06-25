// Importaciones de Firebase optimizadas
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore, collection, doc, setDoc, getDocs, query, orderBy, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Global optimized configuration
const { jsPDF } = window.jspdf;

// Optimized DOM element references
const productsBody = document.getElementById('productsBody');
const addProductBtn = document.getElementById('addProductBtn');
const deliveryTypeSelect = document.getElementById('deliveryType');
const installationCostGroup = document.getElementById('installationCostGroup');
const installationCostInput = document.getElementById('installationCost');
const paymentTypeSelect = document.getElementById('paymentType');
const anticipoGroup = document.getElementById('anticipoGroup');
const customPaymentGroup = document.getElementById('customPaymentGroup');
const anticipoPercentageInput = document.getElementById('anticipoPercentage');
const anticipoAmountInput = document.getElementById('anticipoAmount');
const liquidacionAmountInput = document.getElementById('liquidacionAmount');
const paymentSummaryElement = document.getElementById('paymentSummary');
const customPaymentTextInput = document.getElementById('customPaymentText');
const ivaPercentageInput = document.getElementById('ivaPercentage');
const subtotalDisplay = document.getElementById('subtotalDisplay');
const ivaDisplay = document.getElementById('ivaDisplay');
const totalDisplay = document.getElementById('totalDisplay');
const generatePdfBtn = document.getElementById('generatePdfBtn'); 
const generateProductionOrderBtn = document.getElementById('generateProductionOrderBtn'); 
const saveQuoteBtn = document.getElementById('saveQuoteBtn');
const loadQuoteBtn = document.getElementById('loadQuoteBtn');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const currentUserIdDisplay = document.getElementById('currentUserId');
const productsSummary = document.getElementById('productsSummary');
const observationsText = document.getElementById('observationsText');
const clausesText = document.getElementById('clausesText');
const connectionStatusElement = document.getElementById('connectionStatus');
const ivaToggleCheckbox = document.getElementById('ivaToggleCheckbox');
const userIdDisplaySection = document.getElementById('userIdDisplaySection');

const deliveryServiceToggle = document.getElementById('deliveryServiceToggle');
const deliveryServiceDetailsGroup = document.getElementById('deliveryServiceDetailsGroup');
const deliveryAddressInput = document.getElementById('deliveryAddress');
const deliveryCostInput = document.getElementById('deliveryCost');

const cultivoInput = document.getElementById('cultivo');

const previousQuotesModal = document.getElementById('previousQuotesModal');
const closeQuotesModalBtn = document.getElementById('closeQuotesModal');
const searchQuotesInput = document.getElementById('searchQuotes');
const totalQuotesCount = document.getElementById('totalQuotesCount');
const recentQuotesCount = document.getElementById('recentQuotesCount');
const totalValueSum = document.getElementById('totalValueSum');
const quoteListContent = document.getElementById('quoteListContent');

const productModal = document.getElementById('productModal');
const closeProductModalBtn = document.getElementById('closeProductModal');
const saveProductModalBtn = document.getElementById('saveProductModal');
const cancelProductModalBtn = document.getElementById('cancelProductModal');
const modalQuantityInput = document.getElementById('modalQuantity');
const modalUnitPriceInput = document.getElementById('modalUnitPrice');
const modalProductTypeSelect = document.getElementById('modalProductType');
const modalOtherProductTypeInput = document.getElementById('modalOtherProductType');
const modalMeasureInput = document.getElementById('modalMeasure');
const modalMaterialSelect = document.getElementById('modalMaterial');
const modalSignTypeSelect = document.getElementById('modalSignType');
const modalOtherSignTypeInput = document.getElementById('modalOtherSignType');
const visualReferencePreviewContainer = document.getElementById('visualReferencePreviewContainer');
const visualReferencePreview = document.getElementById('visualReferencePreview');
const visualReferencePlaceholderText = document.getElementById('visualReferencePlaceholderText');

// Autenticación - Nuevas referencias DOM
const authModal = document.getElementById('authModal');
const authModalTitle = document.getElementById('authModalTitle');
const authEmailInput = document.getElementById('authEmail');
const authPasswordInput = document.getElementById('authPassword');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const authMessage = document.getElementById('authMessage');
const authMessageText = document.getElementById('authMessageText');
const logoutBtn = document.getElementById('logoutBtn'); // Botón de cerrar sesión

let editingProductRow = null; 

const defaultIvaValue = 16;
let isIvaActive = true;
let allQuotes = []; 
let filteredQuotes = [];
let currentFilter = 'all'; 

const materials = ['Acrílico', 'PVC', 'Aluminio', 'Estireno', 'Trovicel', 'Lámina Galv.', 'Vinil Adherible', 'Otro'];
const productTypes = [
    'Letrero Sencillo', 'Letrero Doble Vista', 'Letrero en Bandera', 
    'Poste Sencillo', 'Poste Doble Vista', 'Poste 2 Letreros Doble Vista', 
    'Reflejantes', 'Etiqueta Impresa', 'Etiqueta Recorte', 'Lona', 'Otro'
];
const signTypes = ['Indicativos', 'Informativos', 'Preventivos', 'Prohibición', 'Seguridad', 'Otros'];

// Mapeo de productos a imágenes de referencia (usando rutas relativas a /assets/product-images/)
// ¡Importante! Asegúrate de que estas imágenes existen en tu carpeta /assets/product-images/
// con los nombres especificados.
const productImages = {
    'Letrero Sencillo': '/assets/product-images/letrero-sencillo.png',
    'Letrero Doble Vista': '/assets/product-images/letrero-doble-vista.png',
    'Letrero en Bandera': '/assets/product-images/letrero-bandera.png',
    'Poste Sencillo': '/assets/product-images/poste-sencillo.png',
    'Poste Doble Vista': '/assets/product-images/poste-doble-vista.png',
    'Poste 2 Letreros Doble Vista': '/assets/product-images/poste-2letreros-doble-vista.png',
    'Reflejantes': '/assets/product-images/reflejantes.png',
    'Etiqueta Impresa': '/assets/product-images/etiqueta-impresa.png',
    'Etiqueta Recorte': '/assets/product-images/etiqueta-recorte.png',
    'Lona': '/assets/product-images/lona.png',
    // No se incluye "Otro" aquí, ya que no tiene una imagen genérica.
};


// Configuración de Firebase optimizada
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
    apiKey: "AIzaSyDJ5nIijZ4cY7p4LUTvEiO8v__AXOdHDUQ", // Your current Firebase API Key
    authDomain: "cotizador-a040e.firebaseapp.com", // Your current Firebase Auth Domain
    projectId: "cotizador-a040e", // Your current Firebase Project ID
    storageBucket: "cotizador-a040e.firebasestorage.app",
    messagingSenderId: "324248836500",
    appId: "1:324248836500:web:c43ab6b7d7d9b62b671781",
    measurementId: "G-SVDLLK03ND"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
let userId = 'loading...';
let isAuthReady = false;

// Helper function to get the RGB value of a Tailwind color for CSS
function getTailwindRgb(colorName) {
    const colors = {
        'primary': '26, 59, 159', 
        'primary-light': '42, 91, 191', 
        'primary-dark': '14, 42, 132' 
    };
    return colors[colorName]; 
}

// Set CSS variables to use Tailwind colors in direct styles
document.documentElement.style.setProperty('--tw-colors-primary', '#1A3B9F');
document.documentElement.style.setProperty('--tw-colors-primary-light', '#2A5BBF');
document.documentElement.style.setProperty('--tw-colors-primary-dark', '#0E2A84');
document.documentElement.style.setProperty('--tw-primary-light-rgb', '42, 91, 191'); 


// Optimized function to update connection status
function updateConnectionStatus(statusText, isOnline = false) {
    const statusIndicator = document.getElementById('connectionStatus');
    if (statusIndicator) {
        if (isOnline) {
            statusIndicator.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8.59 10 17z"/></svg><span>v5.9 Online</span>`;
            statusIndicator.classList.add('bg-primary-light'); 
            statusIndicator.classList.remove('bg-gray-500'); 
        } else {
            statusIndicator.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8.59 10 17z"/></svg><span>v5.9 ${statusText}</span>`;
            statusIndicator.classList.remove('bg-primary-light');
            statusIndicator.classList.add('bg-gray-500'); 
        }
    }
}

/**
 * Muestra u oculta los campos de servicio a domicilio
 */
function toggleDeliveryServiceFields() {
    if (deliveryServiceToggle.checked) {
        deliveryServiceDetailsGroup.classList.remove('hidden');
    } else {
        deliveryServiceDetailsGroup.classList.add('hidden');
        deliveryAddressInput.value = ''; 
        deliveryCostInput.value = 0; 
    }
}

/**
 * Función para actualizar totales
 */
function updateTotals() {
    let subtotal = 0;
    let productsHtml = '';

    document.querySelectorAll('#productsBody tr').forEach(row => {
        const productData = row.productData;
        const quantity = productData.quantity || 0;
        const productName = productData.productType === 'Otro' ? 
                                    productData.otherProductType : 
                                    productData.productType;
        const unitPrice = productData.unitPrice || 0;
        const amount = quantity * unitPrice;
        subtotal += amount;

        const visualRefHtml = productData.visualReference ?
            `<img src="${productData.visualReference}" alt="${productName}" class="inline-block w-8 h-8 rounded-full mr-2 object-cover border border-white border-opacity-50">` : '';

        productsHtml += `
            <div class="flex justify-between items-start text-base">
                <span class="text-white text-opacity-90 w-3/4 flex items-center">
                    ${visualRefHtml}
                    ${quantity}x ${productName} <br> <span class="text-sm">($${unitPrice.toFixed(2)} c/u)</span>
                </span>
                <span class="font-bold text-white w-1/4 text-right">$${amount.toFixed(2)}</span>
            </div>
        `;
    });

    const installationCost = deliveryTypeSelect.value === 'con_instalacion' ? (parseFloat(installationCostInput.value) || 0) : 0;
    if (installationCost > 0) {
        productsHtml += `
            <div class="flex justify-between items-start text-base pt-2 border-t border-white border-opacity-30 mt-2">
                <span class="text-white text-opacity-90">Costo de Instalación:</span>
                <span class="font-bold text-white text-right">$${installationCost.toFixed(2)}</span>
            </div>
        `;
    }
    subtotal += installationCost;

    const deliveryCost = deliveryServiceToggle.checked ? (parseFloat(deliveryCostInput.value) || 0) : 0;
    if (deliveryCost > 0) {
        productsHtml += `
            <div class="flex justify-between items-start text-base pt-2 border-t border-white border-opacity-30 mt-2">
                <span class="text-white text-opacity-90">Costo por Domicilio:</span>
                <span class="font-bold text-white text-right">$${deliveryCost.toFixed(2)}</span>
            </div>
        `;
    }
    subtotal += deliveryCost;


    productsSummary.innerHTML = productsHtml;

    const ivaPercentage = isIvaActive ? (parseFloat(ivaPercentageInput.value) || 0) : 0;
    const ivaAmount = subtotal * (ivaPercentage / 100);
    const total = subtotal + ivaAmount;

    subtotalDisplay.textContent = `$${total.toFixed(2)}`;
    ivaDisplay.textContent = `$${ivaAmount.toFixed(2)}`;
    totalDisplay.textContent = `$${total.toFixed(2)}`;
    
    updatePaymentCalculations(total);
}

/**
 * Función para actualizar cálculos de pago
 */
function updatePaymentCalculations(total) {
    if (paymentTypeSelect.value === 'anticipo_liquidacion') {
        const anticipoPercentage = parseFloat(anticipoPercentageInput.value) || 0;
        const anticipoAmount = total * (anticipoPercentage / 100);
        const liquidacionAmount = total - anticipoAmount;
        
        anticipoAmountInput.value = anticipoAmount.toFixed(2);
        liquidacionAmountInput.value = liquidacionAmount.toFixed(2);
        
        if (anticipoPercentage === 100) {
            paymentSummaryElement.textContent = 'PAGO COMPLETO AL INICIO';
        } else if (anticipoPercentage === 0) {
            paymentSummaryElement.textContent = 'PAGO COMPLETO CONTRA ENTREGA';
        } else {
            paymentSummaryElement.textContent = `${anticipoPercentage}% ANTICIPO / ${(100 - anticipoPercentage)}% CONTRA ENTREGA`;
        }
    }
}

/**
 * Función para manejar el cambio de tipo de pago
 */
function handlePaymentTypeChange() {
    const paymentType = paymentTypeSelect.value;
    
    if (paymentType === 'anticipo_liquidacion') {
        anticipoGroup.classList.remove('hidden');
        customPaymentGroup.classList.add('hidden');
    } else if (paymentType === 'personalizado') {
        anticipoGroup.classList.add('hidden');
        customPaymentGroup.classList.remove('hidden');
    } else {
        anticipoGroup.classList.add('hidden');
        customPaymentGroup.classList.add('hidden');
    }
    
    updateTotals();
}

/**
 * Función para manejar el cambio de tipo de entrega
 */
function handleDeliveryTypeChange() {
    if (deliveryTypeSelect.value === 'con_instalacion') {
        installationCostGroup.classList.remove('hidden');
    } else {
        installationCostGroup.classList.add('hidden');
        installationCostInput.value = 0;
    }
    updateTotals();
}

/**
 * Función auxiliar para obtener el texto del método de pago.
 */
function getPaymentMethodText() {
    const paymentType = paymentTypeSelect.value;
    
    switch (paymentType) {
        case 'anticipo_liquidacion':
            return paymentSummaryElement.textContent;
        case 'pago_completo':
            return 'PAGO COMPLETO AL INICIO';
        case 'contra_entrega':
            return 'PAGO CONTRA ENTREGA';
        case 'credito':
            return 'PAGO A CRÉDITO';
        case 'personalizado':
            return customPaymentTextInput.value || 'CONDICIONES PERSONALIZADAS';
        default:
            return 'NO ESPECIFICADO';
    }
}
        
document.addEventListener('DOMContentLoaded', () => {
    updateConnectionStatus("Conectando...");
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('issueDate').value = today;
    
    // Prevent zoom on iOS
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Initial Firebase Auth check
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in
            userId = user.uid;
            currentUserIdDisplay.textContent = `ID de Usuario: ${userId}`;
            showMessage('Autenticación exitosa. ID de usuario: ' + userId, 'success');
            updateConnectionStatus("Online", true);
            authModal.classList.add('hidden'); // Hide login modal if logged in
            // Enable main app functionality
            enableAppFunctions(true);
            // Load quotes after successful login
            await showPreviousQuotesModal();
        } else {
            // User is signed out
            userId = 'no-autenticado';
            currentUserIdDisplay.textContent = 'No autenticado';
            showMessage('Por favor, inicia sesión para continuar.', 'info');
            updateConnectionStatus("Offline", false);
            authModal.classList.remove('hidden'); // Show login modal
            // Disable main app functionality until logged in
            enableAppFunctions(false);
        }
        isAuthReady = true; 
    });

    populateProductModalSelects();
    addProductBtn.addEventListener('click', () => openProductModal()); 
    handlePaymentTypeChange(); 
    toggleDeliveryServiceFields(); 
    ivaToggleCheckbox.checked = isIvaActive;
    toggleIvaDisplay();
    
    const elements = document.querySelectorAll('.fade-in-up');
    elements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });

    setupAdvancedEventListeners();
});

/**
 * Habilita o deshabilita las funciones principales de la aplicación.
 * @param {boolean} enable - True para habilitar, false para deshabilitar.
 */
function enableAppFunctions(enable) {
    const mainSections = document.querySelectorAll('section, button:not(#loginBtn):not(#registerBtn)');
    mainSections.forEach(element => {
        if (enable) {
            element.removeAttribute('disabled');
            element.classList.remove('opacity-50', 'pointer-events-none');
        } else {
            element.setAttribute('disabled', 'true');
            element.classList.add('opacity-50', 'pointer-events-none');
        }
    });
    // Los modales siempre deben ser accesibles para sus botones de cerrar, etc.
    previousQuotesModal.classList.toggle('pointer-events-none', !enable);
    productModal.classList.toggle('pointer-events-none', !enable);

    // Asegurarse de que el modal de autenticación no esté deshabilitado
    authModal.removeAttribute('disabled');
    authModal.classList.remove('opacity-50', 'pointer-events-none');
}

/**
 * Configurar event listeners avanzados
 */
function setupAdvancedEventListeners() {
    searchQuotesInput.addEventListener('input', debounce(handleSearch, 300));
    
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', handleFilterChange);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !previousQuotesModal.classList.contains('hidden')) {
            previousQuotesModal.classList.add('hidden');
        }
        if (e.key === 'Escape' && !productModal.classList.contains('hidden')) {
            productModal.classList.add('hidden');
        }
    });

    deliveryServiceToggle.addEventListener('change', () => {
        toggleDeliveryServiceFields();
        updateTotals(); 
    });

    deliveryCostInput.addEventListener('input', updateTotals);
    cultivoInput.addEventListener('input', updateTotals); 

    closeProductModalBtn.addEventListener('click', () => productModal.classList.add('hidden'));
    cancelProductModalBtn.addEventListener('click', () => productModal.classList.add('hidden'));
    saveProductModalBtn.addEventListener('click', saveProductFromModal);

    modalProductTypeSelect.addEventListener('change', () => {
        if (modalProductTypeSelect.value === 'Otro') {
            modalOtherProductTypeInput.classList.remove('hidden');
        } else {
            modalOtherProductTypeInput.classList.add('hidden');
            modalOtherProductTypeInput.value = '';
        }
        displayVisualReference(); 
    });

    modalSignTypeSelect.addEventListener('change', () => {
        if (modalSignTypeSelect.value === 'Otros') {
            modalOtherSignTypeInput.classList.remove('hidden');
        } else {
            modalOtherSignTypeInput.classList.add('hidden');
            modalOtherSignTypeInput.value = '';
        }
    });

    productModal.addEventListener('transitionend', (event) => {
        if (!productModal.classList.contains('hidden')) {
            displayVisualReference();
        }
    });

    // Event listeners para autenticación
    loginBtn.addEventListener('click', loginUser);
    registerBtn.addEventListener('click', registerUser);
    logoutBtn.addEventListener('click', logoutUser); // Event listener para cerrar sesión
}

/**
 * Función para mostrar mensajes de autenticación dentro del modal
 * @param {string} message - El mensaje a mostrar.
 * @param {string} type - 'success', 'error', 'info'.
 */
function showAuthMessage(message, type) {
    authMessageText.textContent = message;
    authMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
    if (type === 'error') {
        authMessage.classList.add('bg-red-100', 'text-red-700');
    } else if (type === 'success') {
        authMessage.classList.add('bg-green-100', 'text-green-700');
    }
    authMessage.classList.remove('hidden');
    setTimeout(() => {
        authMessage.classList.add('hidden');
    }, 5000);
}

/**
 * Inicia sesión de usuario con Email y Contraseña.
 */
async function loginUser() {
    const email = authEmailInput.value;
    const password = authPasswordInput.value;

    if (!email || !password) {
        showAuthMessage('Por favor, ingresa tu correo y contraseña.', 'error');
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        showAuthMessage('Inicio de sesión exitoso.', 'success');
        authModal.classList.add('hidden'); // Hide modal on success
        // onAuthStateChanged will handle UI updates
    } catch (error) {
        console.error("Error during login:", error);
        let errorMessage = 'Error al iniciar sesión.';
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'El formato del correo electrónico es inválido.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'Tu cuenta ha sido deshabilitada.';
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                errorMessage = 'Correo electrónico o contraseña incorrectos.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Demasiados intentos fallidos. Intenta más tarde.';
                break;
        }
        showAuthMessage(errorMessage, 'error');
    }
}

/**
 * Registra un nuevo usuario con Email y Contraseña.
 */
async function registerUser() {
    const email = authEmailInput.value;
    const password = authPasswordInput.value;

    if (!email || !password) {
        showAuthMessage('Por favor, ingresa un correo y contraseña para registrarte.', 'error');
        return;
    }

    if (password.length < 6) {
        showAuthMessage('La contraseña debe tener al menos 6 caracteres.', 'error');
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        showAuthMessage('Registro exitoso. ¡Has iniciado sesión automáticamente!', 'success');
        authModal.classList.add('hidden'); // Hide modal on success
        // onAuthStateChanged will handle UI updates
    } catch (error) {
        console.error("Error during registration:", error);
        let errorMessage = 'Error al registrar usuario.';
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Este correo electrónico ya está en uso.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'El formato del correo electrónico es inválido.';
                break;
            case 'auth/weak-password':
                errorMessage = 'La contraseña es demasiado débil.';
                break;
        }
        showAuthMessage(errorMessage, 'error');
    }
}

/**
 * Cierra la sesión del usuario.
 */
async function logoutUser() {
    try {
        await signOut(auth);
        showMessage('Sesión cerrada exitosamente.', 'info');
        // onAuthStateChanged will handle showing the login modal and disabling app functions
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        showMessage('Error al cerrar sesión: ' + error.message, 'error');
    }
}


/**
 * Rellena los selects del modal de producto con las opciones predefinidas.
 */
function populateProductModalSelects() {
    modalProductTypeSelect.innerHTML = '';
    productTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        modalProductTypeSelect.appendChild(option);
    });

    modalMaterialSelect.innerHTML = '';
    materials.forEach(material => {
        const option = document.createElement('option');
        option.value = material;
        option.textContent = material;
        modalMaterialSelect.appendChild(option);
    });

    modalSignTypeSelect.innerHTML = '';
    signTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        modalSignTypeSelect.appendChild(option);
    });
}

/**
 * Muestra la referencia visual del producto seleccionado en el modal.
 */
function displayVisualReference() {
    const selectedProductType = modalProductTypeSelect.value;
    const imageUrl = productImages[selectedProductType] || null; 

    if (imageUrl) {
        visualReferencePreview.src = imageUrl;
        visualReferencePreview.classList.remove('hidden');
        visualReferencePreviewContainer.classList.remove('hidden');
        visualReferencePlaceholderText.classList.add('hidden');
    } else {
        visualReferencePreview.src = '';
        visualReferencePreview.classList.add('hidden');
        visualReferencePreviewContainer.classList.remove('hidden'); 
        visualReferencePlaceholderText.classList.remove('hidden');
    }
}

/**
 * Abre el modal para añadir un nuevo producto o editar uno existente.
 * @param {HTMLElement} [rowElement=null] - La fila de la tabla a editar, o null si es un nuevo producto.
 */
function openProductModal(rowElement = null) {
    productModal.classList.remove('hidden');
    editingProductRow = rowElement;

    if (rowElement) {
        productModalTitle.textContent = 'Editar Producto';
        const productData = rowElement.productData; 

        modalQuantityInput.value = productData.quantity;
        modalUnitPriceInput.value = productData.unitPrice;
        modalMeasureInput.value = productData.measure;

        modalProductTypeSelect.value = productData.productType;
        if (productData.productType === 'Otro') {
            modalOtherProductTypeInput.classList.remove('hidden');
            modalOtherProductTypeInput.value = productData.otherProductType;
        } else {
            modalOtherProductTypeInput.classList.add('hidden');
            modalOtherProductTypeInput.value = '';
        }

        modalMaterialSelect.value = productData.material;

        modalSignTypeSelect.value = productData.signType;
        if (productData.signType === 'Otros') {
            modalOtherSignTypeInput.classList.remove('hidden');
            modalOtherSignTypeInput.value = productData.otherSignType;
        } else {
            modalOtherSignTypeInput.classList.add('hidden');
            modalOtherSignTypeInput.value = '';
        }

        displayVisualReference();
    } else {
        productModalTitle.textContent = 'Agregar Producto';
        modalQuantityInput.value = 1;
        modalUnitPriceInput.value = 0;
        modalProductTypeSelect.value = productTypes[0]; 
        modalOtherProductTypeInput.classList.add('hidden');
        modalOtherProductTypeInput.value = '';
        modalMeasureInput.value = '';
        modalMaterialSelect.value = materials[0]; 
        modalSignTypeSelect.value = signTypes[0]; 
        modalOtherSignTypeInput.classList.add('hidden');
        modalOtherSignTypeInput.value = '';
        visualReferencePreview.src = '';
        visualReferencePreview.classList.add('hidden');
        visualReferencePlaceholderText.classList.remove('hidden');
        visualReferencePreviewContainer.classList.add('hidden'); 
    }
}

/**
 * Valida los datos del producto antes de guardar
 * @param {Object} productData - Los datos del producto a validar
 * @returns {Object} - Objeto con isValid y mensaje de error si aplica
 */
function validateProductData(productData) {
    if (!productData.quantity || productData.quantity <= 0) {
        return { isValid: false, message: 'La cantidad debe ser mayor a 0' };
    }
    
    if (!productData.unitPrice || productData.unitPrice < 0) {
        return { isValid: false, message: 'El precio unitario debe ser mayor o igual a 0' };
    }
    
    if (!productData.measure || productData.measure.trim() === '') {
        return { isValid: false, message: 'La medida es requerida' };
    }
    
    if (productData.productType === 'Otro' && (!productData.otherProductType || productData.otherProductType.trim() === '')) {
        return { isValid: false, message: 'Debe especificar el tipo de producto' };
    }
    
    if (productData.signType === 'Otros' && (!productData.otherSignType || productData.otherSignType.trim() === '')) {
        return { isValid: false, message: 'Debe especificar el tipo de señalamiento' };
    }
    
    return { isValid: true };
}

/**
 * Muestra un mensaje de error temporal
 * @param {string} message - El mensaje a mostrar
 */
function showValidationError(message) {
    let errorElement = document.getElementById('validationError');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'validationError';
        errorElement.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
        errorElement.style.display = 'none';
        
        const modalBody = document.querySelector('#productModal .modal-body');
        const buttonsContainer = modalBody.querySelector('.flex.justify-end');
        modalBody.insertBefore(errorElement, buttonsContainer);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

/**
 * Guarda los datos del producto desde el modal a la tabla.
 */
function saveProductFromModal() {
    const productData = {
        quantity: parseFloat(modalQuantityInput.value) || 0,
        unitPrice: parseFloat(modalUnitPriceInput.value) || 0,
        productType: modalProductTypeSelect.value,
        otherProductType: modalOtherProductTypeInput.value,
        measure: modalMeasureInput.value,
        material: modalMaterialSelect.value,
        signType: modalSignTypeSelect.value,
        otherSignType: modalOtherSignTypeInput.value,
        visualReference: productImages[modalProductTypeSelect.value] || null 
    };

    const validation = validateProductData(productData);
    if (!validation.isValid) {
        showValidationError(validation.message);
        return; 
    }

    const errorElement = document.getElementById('validationError');
    if (errorElement) {
        errorElement.style.display = 'none';
    }

    if (editingProductRow) {
        editingProductRow.productData = productData; 
        updateProductRowDisplay(editingProductRow, productData); 
    } else {
        addProductRow(productData); 
    }
    productModal.classList.add('hidden');
    updateTotals(); 
}

/**
 * Actualiza la visualización de una fila existente de la tabla con nuevos datos del producto.
 * @param {HTMLElement} rowElement - La fila de la tabla a actualizar.
 * @param {Object} productData - Los nuevos datos del producto.
 */
function updateProductRowDisplay(rowElement, productData) {
    rowElement.cells[0].textContent = productData.quantity;
    rowElement.cells[1].textContent = productData.productType === 'Otro' ? productData.otherProductType : productData.productType;
    rowElement.cells[2].textContent = productData.measure;
    rowElement.cells[3].textContent = productData.material;
    rowElement.cells[4].textContent = productData.signType === 'Otros' ? productData.otherSignType : productData.signType;
    rowElement.cells[5].textContent = `$${(productData.unitPrice || 0).toFixed(2)}`;
    const amount = (productData.quantity || 0) * (productData.unitPrice || 0);
    rowElement.cells[6].textContent = `$${amount.toFixed(2)}`;
}

/**
 * Añade una nueva fila de producto a la tabla.
 * @param {Object} productData - Los datos del producto a añadir.
 */
function addProductRow(productData) {
    const newRow = productsBody.insertRow();
    newRow.productData = productData; 

    const cellQuantity = newRow.insertCell();
    const cellProduct = newRow.insertCell();
    const cellMeasure = newRow.insertCell();
    const cellMaterial = newRow.insertCell();
    const cellSignType = newRow.insertCell();
    const cellUnitPrice = newRow.insertCell();
    const cellAmount = newRow.insertCell();
    const cellActions = newRow.insertCell();

    newRow.classList.add('table-row', 'border-b', 'border-border-light');
    Object.values(newRow.cells).forEach(cell => {
        cell.classList.add('px-4', 'py-3', 'text-sm', 'text-text-primary');
    });

    updateProductRowDisplay(newRow, productData);

    cellActions.classList.add('flex', 'items-center', 'gap-2');
    const editButton = document.createElement('button');
    editButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
    editButton.classList.add('btn-secondary', 'p-2', 'text-xs');
    editButton.onclick = () => openProductModal(newRow);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
    deleteButton.classList.add('btn-danger', 'p-2', 'text-xs');
    deleteButton.onclick = () => {
        newRow.remove();
        updateTotals();
    };

    cellActions.appendChild(editButton);
    cellActions.appendChild(deleteButton);
}

/**
 * Función debounce para optimizar búsqueda
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Manejar búsqueda de cotizaciones
 */
function handleSearch() {
    const searchTerm = searchQuotesInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredQuotes = [...allQuotes]; 
    } else {
        filteredQuotes = allQuotes.filter(quote => {
            const clientName = (quote.client.name || '').toLowerCase();
            const purchaseOrder = (quote.client.purchaseOrder || '').toLowerCase();
            const requestedBy = (quote.client.requestedBy || '').toLowerCase();
            const cultivo = (quote.client.cultivo || '').toLowerCase(); 
            const productTypeMatch = quote.products.some(p => {
                const type = (p.productType || '').toLowerCase();
                const otherType = (p.otherProductType || '').toLowerCase();
                return type.includes(searchTerm) || otherType.includes(searchTerm);
            });
            const total = calculateQuoteTotal(quote).toFixed(2); 
            
            return clientName.includes(searchTerm) || 
                           purchaseOrder.includes(searchTerm) ||
                           requestedBy.includes(searchTerm) ||
                           cultivo.includes(searchTerm) || 
                           productTypeMatch || 
                           total.includes(searchTerm);
        });
    }
    
    applyCurrentFilter(); 
    renderQuotesList();
}

/**
 * Manejar cambio de filtros
 */
function handleFilterChange(e) {
    document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentFilter = e.target.dataset.filter;
    handleSearch(); 
}

/**
 * Aplicar filtro actual
 */
function applyCurrentFilter() {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    switch (currentFilter) {
        case 'recent':
            filteredQuotes = filteredQuotes.filter(quote => 
                new Date(quote.createdAt) >= oneWeekAgo
            );
            break;
        case 'high-value':
            filteredQuotes = filteredQuotes.filter(quote => 
                calculateQuoteTotal(quote) >= 10000 
            );
            break;
        case 'this-month':
            filteredQuotes = filteredQuotes.filter(quote => 
                new Date(quote.createdAt) >= thisMonthStart && new Date(quote.createdAt) < new Date(now.getFullYear(), now.getMonth() + 1, 1)
            );
            break;
        case 'all':
        default:
            break;
    }
}

/**
 * Calcular total de una cotización
 */
function calculateQuoteTotal(quote) {
    const subtotal = (quote.subtotal || 0) + (quote.config.installationCost || 0) + (quote.config.deliveryCost || 0);
    const ivaAmount = (typeof quote.config.isIvaActive === 'boolean' ? quote.config.isIvaActive : true) ? subtotal * ((quote.config.ivaPercentage || 0) / 100) : 0;
    return subtotal + ivaAmount;
}

/**
 * Función optimizada para mostrar mensajes
 */
function showMessage(message, type) {
    messageText.textContent = message;
    messageBox.classList.remove('hidden');
    
    messageBox.classList.remove('bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800', 'bg-blue-100', 'text-blue-800');
    
    if (type === 'success') {
        messageBox.classList.add('bg-green-100', 'text-green-800');
    } else if (type === 'error') {
        messageBox.classList.add('bg-red-100', 'text-red-800');
    } else {
        messageBox.classList.add('bg-blue-100', 'text-blue-800');
    }
    
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 3000);
}

/**
 * Función optimizada para guardar cotización
 */
async function saveQuote() {
    if (!isAuthReady || userId === 'no-autenticado') {
        showMessage('Debes iniciar sesión para guardar cotizaciones.', 'error');
        return;
    }

    const quoteData = {
        createdAt: new Date().toISOString(),
        client: {
            name: document.getElementById('clientName').value || 'Cliente sin nombre',
            purchaseOrder: document.getElementById('purchaseOrder').value || 'N/A',
            issueDate: document.getElementById('issueDate').value,
            deliveryDate: document.getElementById('deliveryDate').value,
            requestedBy: document.getElementById('requestedBy').value || 'N/A',
            position: document.getElementById('clientPosition').value || 'N/A',
            cultivo: cultivoInput.value || 'N/A' 
        },
        config: {
            paymentType: paymentTypeSelect.value,
            anticipoPercentage: parseFloat(anticipoPercentageInput.value) || 0,
            customPaymentText: customPaymentTextInput.value,
            deliveryType: deliveryTypeSelect.value,
            installationCost: parseFloat(installationCostInput.value) || 0,
            deliveryService: deliveryServiceToggle.checked,
            deliveryAddress: deliveryAddressInput.value,
            deliveryCost: parseFloat(deliveryCostInput.value) || 0,
            ivaPercentage: parseFloat(ivaPercentageInput.value) || 0,
            isIvaActive: isIvaActive
        },
        observations: observationsText.value,
        clauses: clausesText.value,
        subtotal: parseFloat(totalDisplay.textContent.replace('$', '')) || 0, 
        products: []
    };

    document.querySelectorAll('#productsBody tr').forEach(row => {
        const product = row.productData;
        quoteData.products.push(product);
    });

    try {
        const newDocRef = doc(collection(db, `artifacts/${appId}/users/${userId}/quotes`));
        await setDoc(newDocRef, quoteData);
        showMessage('Cotización guardada exitosamente!', 'success');
    } catch (error) {
        console.error("Error al guardar la cotización:", error);
        showMessage('Error al guardar la cotización: ' + error.message, 'error');
    }
}

/**
 * Función optimizada para cargar cotización seleccionada
 */
function loadSelectedQuote(quoteData) {
    document.getElementById('clientName').value = quoteData.client.name || '';
    document.getElementById('purchaseOrder').value = quoteData.client.purchaseOrder || '';
    document.getElementById('issueDate').value = quoteData.client.issueDate || '';
    document.getElementById('deliveryDate').value = quoteData.client.deliveryDate || '';
    document.getElementById('requestedBy').value = quoteData.client.requestedBy || '';
    document.getElementById('clientPosition').value = quoteData.client.position || '';
    cultivoInput.value = quoteData.client.cultivo || ''; 

    paymentTypeSelect.value = quoteData.config.paymentType || 'anticipo_liquidacion';
    anticipoPercentageInput.value = quoteData.config.anticipoPercentage || 50;
    customPaymentTextInput.value = quoteData.config.customPaymentText || '';
    
    deliveryTypeSelect.value = quoteData.config.deliveryType || 'sin_instalacion';
    installationCostInput.value = quoteData.config.installationCost || 0;
    
    deliveryServiceToggle.checked = quoteData.config.deliveryService || false;
    deliveryAddressInput.value = quoteData.config.deliveryAddress || '';
    deliveryCostInput.value = parseFloat(quoteData.config.deliveryCost || 0); 
    toggleDeliveryServiceFields(); 

    ivaPercentageInput.value = quoteData.config.ivaPercentage || defaultIvaValue;
    isIvaActive = (typeof quoteData.config.isIvaActive === 'boolean') ? quoteData.config.isIvaActive : true;
    ivaToggleCheckbox.checked = isIvaActive;
    toggleIvaDisplay();

    observationsText.value = quoteData.observations || '';
    clausesText.value = quoteData.clauses || '';

    productsBody.innerHTML = ''; 

    if (Array.isArray(quoteData.products)) {
        quoteData.products.forEach(product => {
            addProductRow(product); 
        });
    }

    handleDeliveryTypeChange();
    handlePaymentTypeChange();
    updateTotals();
    showMessage('Cotización cargada exitosamente!', 'success');
    previousQuotesModal.classList.add('hidden'); 
}

/**
 * Función mejorada para mostrar modal de cotizaciones anteriores
 */
async function showPreviousQuotesModal() {
    if (!isAuthReady || userId === 'no-autenticado') {
        showMessage('Debes iniciar sesión para cargar cotizaciones.', 'error');
        return;
    }

    previousQuotesModal.classList.remove('hidden');
    quoteListContent.innerHTML = `
        <div class="flex items-center justify-center py-8">
            <div class="loading-spinner"></div>
            <span class="ml-2 text-text-secondary">Cargando cotizaciones...</span>
        </div>
    `;
    noQuotesMessage.classList.add('hidden');

    try {
        const quotesRef = collection(db, `artifacts/${appId}/users/${userId}/quotes`);
        const q = query(quotesRef, orderBy('createdAt', 'desc')); 
        const querySnapshot = await getDocs(q);

        allQuotes = [];
        querySnapshot.forEach(doc => {
            allQuotes.push({ id: doc.id, ...doc.data() });
        });

        if (allQuotes.length === 0) {
            noQuotesMessage.classList.remove('hidden');
            quoteListContent.innerHTML = '';
            updateStatistics(); 
            return;
        }

        searchQuotesInput.value = '';
        currentFilter = 'all';
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');

        filteredQuotes = [...allQuotes];
        handleSearch(); 
        updateStatistics();


    } catch (error) {
        console.error("Error al cargar las cotizaciones:", error);
        showMessage('Error al cargar cotizaciones: ' + error.message, 'error');
        noQuotesMessage.classList.remove('hidden');
        quoteListContent.innerHTML = '';
    }
}

/**
 * Actualizar estadísticas
 */
function updateStatistics() {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentQuotes = allQuotes.filter(quote => new Date(quote.createdAt) >= oneWeekAgo);
    const totalValue = allQuotes.reduce((sum, quote) => sum + calculateQuoteTotal(quote), 0);

    totalQuotesCount.textContent = allQuotes.length;
    recentQuotesCount.textContent = recentQuotes.length;
    totalValueSum.textContent = `$${totalValue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Renderizar lista de cotizaciones
 */
function renderQuotesList() {
    if (filteredQuotes.length === 0) {
        quoteListContent.innerHTML = `
            <div class="text-center py-8 text-text-secondary">
                <svg class="mx-auto mb-4 w-16 h-16 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <p class="text-lg font-medium">No se encontraron cotizaciones</p>
                <p class="text-sm">Intenta con otros términos de búsqueda o filtros</p>
            </div>
        `;
        return;
    }

    const quotesHtml = filteredQuotes.map(quote => {
        const date = new Date(quote.createdAt);
        const isRecent = (new Date() - date) < 7 * 24 * 60 * 60 * 1000;
        const total = calculateQuoteTotal(quote);
        
        return `
            <div class="quote-item" data-quote-id="${quote.id}" tabindex="0">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <h3 class="font-semibold text-primary text-lg">${quote.client.name || 'Cliente sin nombre'}</h3>
                            ${isRecent ? '<span class="status-badge recent">Reciente</span>' : '<span class="status-badge old">Antigua</span>'}
                        </div>
                        <div class="grid grid-cols-2 gap-4 text-sm text-text-secondary mb-3">
                            <div>
                                <span class="font-medium">Fecha:</span> ${date.toLocaleDateString()}
                            </div>
                            <div>
                                <span class="font-medium">Hora:</span> ${date.toLocaleTimeString()}
                            </div>
                            <div>
                                <span class="font-medium">OC:</span> ${quote.client.purchaseOrder || 'N/A'}
                            </div>
                            <div>
                                <span class="font-medium">Productos:</span> ${quote.products.length}
                            </div>
                        </div>
                        <div class="quote-preview">
                            <div class="flex justify-between items-center">
                                <span class="text-sm font-medium text-text-secondary">Total de la cotización:</span>
                                <span class="text-xl font-bold text-primary">$${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="quote-actions">
                    <button class="btn-secondary text-sm" onclick="loadQuoteById('${quote.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline mr-1">
                            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                        </svg>
                        Cargar
                    </button>
                    <button class="btn-secondary text-sm" onclick="duplicateQuoteById('${quote.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                        </svg>
                        Duplicar
                    </button>
                    <button class="btn-danger text-sm" onclick="deleteQuoteById('${quote.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline mr-1">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                        </svg>
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    }).join('');

    quoteListContent.innerHTML = quotesHtml;

    filteredQuotes.forEach(quote => {
        const quoteItemElement = quoteListContent.querySelector(`[data-quote-id="${quote.id}"]`);
        if (quoteItemElement) {
            quoteItemElement.querySelector('.btn-secondary:nth-of-type(1)').onclick = () => loadQuoteById(quote.id); 
            quoteItemElement.querySelector('.btn-secondary:nth-of-type(2)').onclick = () => duplicateQuoteById(quote.id); 
            quoteItemElement.querySelector('.btn-danger').onclick = () => deleteQuoteById(quote.id); 
        }
    });
}

/**
 * Cargar cotización por ID (hacerla global para onclick en HTML)
 */
window.loadQuoteById = function(quoteId) {
    const quote = allQuotes.find(q => q.id === quoteId);
    if (quote) {
        loadSelectedQuote(quote);
    } else {
        showMessage('Cotización no encontrada.', 'error');
    }
};

/**
 * Duplicar cotización por ID (hacerla global para onclick en HTML)
 */
window.duplicateQuoteById = async function(quoteId) {
    if (!isAuthReady || userId === 'no-autenticado') {
        showMessage('Debes iniciar sesión para duplicar cotizaciones.', 'error');
        return;
    }

    const originalQuote = allQuotes.find(q => q.id === quoteId);
    if (!originalQuote) {
        showMessage('Cotización original no encontrada para duplicar.', 'error');
        return;
    }

    showMessage('Duplicando cotización...', 'info');

    const duplicatedQuoteData = JSON.parse(JSON.stringify(originalQuote));

    duplicatedQuoteData.createdAt = new Date().toISOString(); 
    duplicatedQuoteData.client.name = `${originalQuote.client.name || 'Cliente sin nombre'} (Copia)`; 
    
    delete duplicatedQuoteData.id; 

    try {
        const newDocRef = doc(collection(db, `artifacts/${appId}/users/${userId}/quotes`));
        await setDoc(newDocRef, duplicatedQuoteData);
        showMessage('Cotización duplicada exitosamente!', 'success');
        
        await showPreviousQuotesModal();
    } catch (error) {
        console.error("Error al duplicar la cotización:", error);
        showMessage('Error al duplicar la cotización: ' + error.message, 'error');
    }
};

/**
 * Eliminar cotización por ID (hacerla global para onclick en HTML)
 */
window.deleteQuoteById = async function(quoteId) {
    if (!isAuthReady || userId === 'no-autenticado') {
        showMessage('Debes iniciar sesión para eliminar cotizaciones.', 'error');
        return;
    }

    showMessage('Eliminando cotización...', 'info');

    try {
        await deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/quotes`, quoteId));
        showMessage('Cotización eliminada exitosamente!', 'success');
        
        allQuotes = allQuotes.filter(q => q.id !== quoteId);
        handleSearch(); 
        updateStatistics();
        
        if (allQuotes.length === 0) {
            noQuotesMessage.classList.remove('hidden');
            quoteListContent.innerHTML = ''; 
        }
    } catch (error) {
        console.error("Error al eliminar la cotización:", error);
        showMessage('Error al eliminar la cotización: ' + error.message, 'error');
    }
};

/**
 * Función optimizada para toggle de IVA
 */
function toggleIva() {
    isIvaActive = ivaToggleCheckbox.checked;
    if (isIvaActive) {
        ivaPercentageInput.value = defaultIvaValue;
    } else {
        ivaPercentageInput.value = 0;
    }
    toggleIvaDisplay();
    updateTotals();
}

/**
 * Función optimizada para display de IVA
 */
function toggleIvaDisplay() {
    if (isIvaActive) {
        ivaPercentageInput.readOnly = false;
    } else {
        ivaPercentageInput.readOnly = true;
        ivaPercentageInput.value = 0;
    }
}

/**
 * Función optimizada para generar PDF (compatible con iOS Safari)
 * @param {boolean} forProductionOrder - Si es true, oculta los precios y ajusta el título.
 */
function generatePDF(forProductionOrder = false) {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    doc.setFont('helvetica', 'normal');

    const docTitle = forProductionOrder ? 'ORDEN DE PRODUCCIÓN DE SEÑALÉTICA' : 'COTIZACIÓN DE SEÑALÉTICA';
    if (forProductionOrder) {
        doc.setFontSize(12); 
    } else {
        doc.setFontSize(20);
    }
    doc.setTextColor(
        parseInt(getTailwindRgb('primary').split(',')[0]),
        parseInt(getTailwindRgb('primary').split(',')[1]),
        parseInt(getTailwindRgb('primary').split(',')[2])
    );
    doc.setFont('helvetica', 'bold');
    doc.text(docTitle, 20, 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('versión 5.9', 20, 26); 
    
    // Ruta actualizada para el logo SSA en el PDF
    const imgUrl = '/assets/logo ssa.png'; 
    doc.addImage(imgUrl, 'PNG', 150, 10, 40, 40, '', 'FAST'); 
    
    let yPosition = 35;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL CLIENTE', 20, yPosition);
    yPosition += 6;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const clientData = [
        ['Cliente:', document.getElementById('clientName').value],
        ['Orden de Compra:', document.getElementById('purchaseOrder').value],
        ['Fecha de Emisión:', document.getElementById('issueDate').value],
        ['Fecha de Entrega:', document.getElementById('deliveryDate').value],
        ['Solicitado por:', document.getElementById('requestedBy').value],
        ['Cargo/Área:', document.getElementById('clientPosition').value],
        ['Cultivo:', cultivoInput.value] 
    ];
    
    clientData.forEach(([label, value]) => {
        doc.text(label, 20, yPosition);
        doc.text(value || 'N/A', 70, yPosition);
        yPosition += 4;
    });

    if (deliveryServiceToggle.checked && deliveryAddressInput.value && forProductionOrder) {
        doc.text('Dirección de Entrega:', 20, yPosition);
        const splitAddress = doc.splitTextToSize(deliveryAddressInput.value, 120);
        doc.text(splitAddress, 70, yPosition);
        yPosition += (splitAddress.length * 4); 
    }
    
    yPosition += 8; 

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PRODUCTOS / SERVICIOS COTIZADOS', 20, yPosition);
    yPosition += 6;

    const tableData = [];
    document.querySelectorAll('#productsBody tr').forEach(row => {
        const product = row.productData; 
        const quantity = product.quantity;
        const productName = product.productType === 'Otro' ? product.otherProductType : product.productType;
        const measure = product.measure;
        const material = product.material;
        const signType = product.signType === 'Otros' ? product.otherSignType : product.signType; 
        const unitPrice = parseFloat(product.unitPrice || 0).toFixed(2);
        const amount = (quantity * unitPrice).toFixed(2);
        
        tableData.push([
            quantity, 
            productName, 
            measure, 
            material, 
            signType, 
            forProductionOrder ? 'N/A' : `$${unitPrice}`, 
            forProductionOrder ? 'N/A' : `$${amount}` 
        ]);
    });
    
    doc.autoTable({
        head: [['Cant.', 'Producto', 'Medida', 'Material', 'Tipo Señalamiento', 'C/U', 'Importe']], 
        body: tableData,
        startY: yPosition,
        theme: 'grid',
        headStyles: {
            fillColor: [
                parseInt(getTailwindRgb('primary-light').split(',')[0]),
                parseInt(getTailwindRgb('primary-light').split(',')[1]),
                parseInt(getTailwindRgb('primary-light').split(',')[2])
            ],
            textColor: 255,
            fontSize: 8,
            fontStyle: 'bold'
        },
        bodyStyles: {
            fontSize: 7,
            cellPadding: 1,
            minCellHeight: 5
        },
        columnStyles: {
            1: { cellWidth: 25 }, 
            2: { cellWidth: 15 }, 
            3: { cellWidth: 15 }, 
            4: { cellWidth: 20 }, 
            5: { halign: 'right' }, 
            6: { halign: 'right' }  
        },
        margin: { left: 20, right: 20 }
    });
    
    let currentY = doc.lastAutoTable.finalY + 8;

    if (!forProductionOrder) { 
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('TOTALES', 20, currentY);
        currentY += 6;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Subtotal:', 130, currentY);
        doc.text(subtotalDisplay.textContent, 170, currentY, { align: 'right' });
        currentY += 5;

        doc.text(`IVA (${ivaPercentageInput.value}%):`, 130, currentY);
        doc.text(ivaDisplay.textContent, 170, currentY, { align: 'right' });
        currentY += 8;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL:', 130, currentY);
        doc.text(totalDisplay.textContent, 170, currentY, { align: 'right' });
        currentY += 20;
    } else {
        currentY += 10; 
    }
    

    if (!forProductionOrder) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('FORMA DE PAGO:', 20, currentY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const paymentText = getPaymentMethodText();
        const splitPaymentText = doc.splitTextToSize(paymentText, 170);
        doc.text(splitPaymentText, 20, currentY + 5);
        currentY += (splitPaymentText.length * 4) + 8;
        
        if (paymentTypeSelect.value === 'anticipo_liquidacion') { 
            const anticipoAmount = anticipoAmountInput.value;
            const liquidacionAmount = liquidacionAmountInput.value;
            
            doc.setFontSize(9);
            doc.text(`Anticipo: $${anticipoAmount}`, 20, currentY);
            currentY += 4;
            doc.text(`Liquidación: $${liquidacionAmount}`, 20, currentY);
            currentY += 8;
        }
    } else {
        currentY += 10; 
    }


    const observations = observationsText.value;
    if (observations) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVACIONES:', 20, currentY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        const splitObservations = doc.splitTextToSize(observations, 170);
        doc.text(splitObservations, 20, currentY + 5);
        currentY += (splitObservations.length * 3.5) + 8;
    }

    if (!forProductionOrder) {
        const selectedClauses = clausesText.value.split('\n'); 
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('CLÁUSULAS IMPORTANTES:', 20, currentY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        selectedClauses.forEach((clause) => {
            const splitClause = doc.splitTextToSize(clause, 170);
            doc.text(splitClause, 20, currentY + 5);
            currentY += (splitClause.length * 3.5) + 3;
        });
    } else {
        currentY += 10; 
    }
    
    const footerY = doc.internal.pageSize.height - 10;
    doc.setFontSize(8);
    doc.setTextColor(127, 127, 127);
    doc.setFont('helvetica', 'normal');
    doc.text('Cotización realizada por: Corporativo Innovar', 105, footerY, { align: 'center' });
    
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    let filename = `Cotizacion_${document.getElementById('clientName').value || 'Cliente'}_${new Date().toISOString().split('T')[0]}.pdf`;
    if (forProductionOrder) {
        filename = `Orden_Produccion_${document.getElementById('clientName').value || 'Cliente'}_${new Date().toISOString().split('T')[0]}.pdf`;
    }

    const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOSSafari) {
        window.open(pdfUrl, '_blank');
    } else {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = filename;
        link.click();
    }
    
    showMessage(`PDF de ${forProductionOrder ? 'Orden de Producción' : 'Cotización'} generado exitosamente`, 'success');
}

// Event Listeners optimizados
deliveryTypeSelect.addEventListener('change', handleDeliveryTypeChange);
installationCostInput.addEventListener('input', updateTotals);
ivaPercentageInput.addEventListener('input', updateTotals);
ivaToggleCheckbox.addEventListener('change', toggleIva);
paymentTypeSelect.addEventListener('change', handlePaymentTypeChange);
anticipoPercentageInput.addEventListener('input', () => {
    updatePaymentCalculations(parseFloat(totalDisplay.textContent.replace('$', '')) || 0);
});
generatePdfBtn.addEventListener('click', () => generatePDF(false)); 
generateProductionOrderBtn.addEventListener('click', () => generatePDF(true)); 

saveQuoteBtn.addEventListener('click', saveQuote);
loadQuoteBtn.addEventListener('click', showPreviousQuotesModal);

closeQuotesModalBtn.addEventListener('click', () => {
    previousQuotesModal.classList.add('hidden');
});

window.addEventListener('click', (event) => {
    if (event.target == previousQuotesModal) {
        previousQuotesModal.classList.add('hidden');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !previousQuotesModal.classList.contains('hidden')) {
        previousQuotesModal.classList.add('hidden');
    }
});
