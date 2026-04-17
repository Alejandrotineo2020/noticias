const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const API_URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&category=technology,science&language=es`;

const newsGrid = document.getElementById('news-grid');
const btnDownload = document.getElementById('btn-download');
let newsList = [];

// Imagen por defecto si la original falla o no existe
const DEFAULT_IMG = "https://images.unsplash.com/photo-1504711432869-5d39a110fdd7?q=80&w=1000&auto=format&fit=crop";

async function getNews() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.results) {
            newsList = data.results;
            renderCards(newsList);
        }
    } catch (error) {
        newsGrid.innerHTML = `
            <div class="col-12 text-center text-danger">
                <i class="fa-solid fa-triangle-exclamation fa-3x mb-3"></i>
                <p>Error al cargar las noticias. Verifica la API Key en el archivo .env</p>
            </div>`;
    }
}

function renderCards(articles) {
    newsGrid.innerHTML = '';
    articles.forEach(art => {
        const date = art.pubDate ? new Date(art.pubDate).toLocaleDateString() : 'Reciente';
        
        newsGrid.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <article class="card card-news shadow">
                    <div class="card-img-container">
                        <img src="${art.image_url || DEFAULT_IMG}" class="card-img-top" alt="news">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="mb-2 d-flex justify-content-between align-items-center">
                            <span class="source-badge">${art.source_id.toUpperCase()}</span>
                            <small class="text-secondary"><i class="fa-regular fa-calendar-days"></i> ${date}</small>
                        </div>
                        <h5 class="card-title">${art.title}</h5>
                        <p class="card-text text-secondary small flex-grow-1">
                            ${art.description ? art.description.substring(0, 100) + '...' : 'Haz clic para leer el contexto completo de esta noticia.'}
                        </p>
                        <a href="${art.link}" target="_blank" class="btn btn-visit btn-sm mt-3">
                            Leer Noticia <i class="fa-solid fa-arrow-up-right-from-square ms-1"></i>
                        </a>
                    </div>
                </article>
            </div>
        `;
    });
}

function generateTXT() {
    if (newsList.length === 0) return alert("No hay noticias cargadas.");

    let fileContent = `==================================================\n`;
    fileContent += `   REPORT DE NOTICIAS TECH & CIENCIA - TOP 10     \n`;
    fileContent += `   Generado por: Alex.devCode                      \n`;
    fileContent += `   Fecha: ${new Date().toLocaleString()}          \n`;
    fileContent += `==================================================\n\n`;

    newsList.slice(0, 10).forEach((art, index) => {
        // Redacción profesional en dos párrafos
        const paragraph1 = art.description 
            ? `CONTEXTO: ${art.description.split('.')[0]}. Esta noticia surge en un entorno global de constante innovación dentro del sector de ${art.category[0]}, marcando un hito en la agenda informativa actual.`
            : `CONTEXTO: Se informa sobre un avance relevante reportado por ${art.source_id}. El suceso se enmarca en la evolución tecnológica contemporánea, demandando atención por su impacto potencial en la industria.`;

        const paragraph2 = `CARACTERÍSTICAS: El reporte destaca por su relevancia técnica y la prontitud de su difusión. Entre sus puntos clave se encuentra la validación de datos por parte de ${art.source_id} y su conexión directa con las tendencias emergentes de este trimestre.`;

        fileContent += `${index + 1}. ${art.title.toUpperCase()}\n`;
        fileContent += `--------------------------------------------------\n`;
        fileContent += `FUENTE: ${art.source_id.toUpperCase()} | 📅 ${art.pubDate}\n\n`;
        fileContent += `${paragraph1}\n\n`;
        fileContent += `${paragraph2}\n\n`;
        fileContent += `LINK DIRECTO: ${art.link}\n`;
        fileContent += `\n\n`;
    });

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AlexDevCode_Top10_Tech.txt`;
    link.click();
    URL.revokeObjectURL(url);
}

btnDownload.addEventListener('click', generateTXT);
getNews();