async function loadBlog() {
    const container = document.getElementById('blog-container');
    const hero = document.getElementById('blog-hero'); // Leiame blogi päise
    if (!container) return;

    // Vaatame, kas aadressiribal on küsitud konkreetset postitust
    const urlParams = new URLSearchParams(window.location.search);
    const currentPost = urlParams.get('post');

    try {
        // blog-loader.js (ainult postituse vaate osa täiendus)
        if (currentPost) {
            if (hero) hero.style.display = 'none';
            
            // Teeme lugemisala laiemaks ja puhtamaks
            container.className = ""; 
            container.style.maxWidth = "1400px"; // Suurendasime 800px pealt 1000px peale
            container.style.margin = "40px auto";
            container.style.padding = "0 20px";

            const response = await fetch(`assets/blog/${currentPost}`);
            if (!response.ok) throw new Error(`Ei leidnud faili nimega: ${currentPost}`);
            
            const markdownText = await response.text();
            const htmlContent = marked.parse(markdownText);
            
            container.innerHTML = `
                <a href="blogi.html" style="display:inline-block; margin-bottom: 30px; color: var(--brand-dark); text-decoration: none; font-weight: bold; font-size: 1.1rem; padding: 10px 25px; border: 2px solid var(--brand-dark); border-radius: 50px; transition: 0.3s;">← Tagasi blogisse</a>
                <div class="blog-post-full">
                    ${htmlContent}
                </div>
            `;
        } else {
            // 2. NIMEKIRJA VAADE: Näitame "Peasport Blogi" kirja uuesti
            if (hero) hero.style.display = 'flex';
            
            // Taastame algsed klassid ja laiused nimekirja jaoks
            container.className = "glass-container";
            container.style.maxWidth = "1200px";
            container.style.padding = "40px";
            container.style.margin = "20px auto";

            const indexResponse = await fetch('assets/blog/index.json');
            if (!indexResponse.ok) throw new Error(`Ei leidnud index.json faili.`);
            
            let posts;
            try {
                posts = await indexResponse.json();
            } catch (e) {
                throw new Error(`index.json failis on viga. Kontrolli komasid ja jutumärke!`);
            }

            let listHtml = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto;">';
            
            for (const post of posts) {
                const imageHtml = post.image 
                    ? `<img src="${post.image}" alt="${post.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">` 
                    : '';

                listHtml += `
                    <div class="blog-card" style="background: rgba(255,255,255,0.4); backdrop-filter: blur(15px); padding: 30px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.3); text-align: left; display: flex; flex-direction: column;">
                        ${imageHtml}
                        <h2 style="margin-top: 0; color: var(--brand-dark); font-size: 1.5rem;">${post.title}</h2>
                        <p style="color: var(--text-main); margin-bottom: 25px; flex-grow: 1;">${post.excerpt}</p>
                        <a href="?post=${post.file}" class="cta-button" style="display: inline-block; font-size: 0.9rem; align-self: flex-start;">Loe edasi</a>
                    </div>
                `;
            }
            listHtml += '</div>';
            container.innerHTML = listHtml;
        }

    } catch (error) {
        console.error("Viga blogi laadimisel:", error);
        container.innerHTML = `
            <div style="background: #ffc5c5; padding: 20px; border-radius: 10px; color: #333; text-align: left; max-width: 600px; margin: 0 auto;">
                <h3 style="margin-top: 0;">Blogi laadimine ebaõnnestus</h3>
                <p><strong>Põhjus:</strong> ${error.message}</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', loadBlog);