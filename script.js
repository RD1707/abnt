document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DA UI ---
    const form = document.getElementById('abnt-form');
    const toastElement = document.getElementById('toast');
    const capaOutput = document.getElementById('capa-output');
    const folhaRostoOutput = document.getElementById('folha-rosto-output');
    const sumarioOutput = document.getElementById('sumario-output');
    const contentArea = document.querySelector('.content');

    // --- FUNÇÕES AUXILIARES ---
    const showToast = (message, type = 'success') => {
        toastElement.textContent = message;
        toastElement.className = `toast show ${type}`;
        setTimeout(() => toastElement.classList.remove('show'), 3000);
    };

    // --- EVENTO PRINCIPAL: GERA OS ELEMENTOS ---
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const requiredFields = ['instituicao', 'faculdade', 'curso', 'autor', 'titulo', 'local', 'ano', 'tipo_trabalho', 'grau_academico', 'orientador'];
        let isValid = true;
        
        requiredFields.forEach(id => {
            const field = document.getElementById(id);
            if (!field.value.trim()) {
                field.classList.add('erro');
                isValid = false;
            } else {
                field.classList.remove('erro');
            }
        });
        
        if (!isValid) {
            showToast('Preencha todos os campos obrigatórios (*)!', 'error');
            return;
        }

        const dados = {
            instituicao: document.getElementById('instituicao').value.trim(),
            faculdade: document.getElementById('faculdade').value.trim(),
            curso: document.getElementById('curso').value.trim(),
            autor: document.getElementById('autor').value.trim(),
            titulo: document.getElementById('titulo').value.trim(),
            subtitulo: document.getElementById('subtitulo').value.trim(),
            local: document.getElementById('local').value.trim(),
            ano: document.getElementById('ano').value,
            tipo_trabalho: document.getElementById('tipo_trabalho').value.trim(),
            grau_academico: document.getElementById('grau_academico').value.trim(),
            area_concentracao: document.getElementById('area_concentracao').value.trim(),
            orientador: document.getElementById('orientador').value.trim(),
            coorientador: document.getElementById('coorientador').value.trim(),
            sumario: document.getElementById('sumario-conteudo').value,
        };

        try {
            capaOutput.innerHTML = gerarCapa(dados);
            folhaRostoOutput.innerHTML = gerarFolhaRosto(dados);
            sumarioOutput.innerHTML = gerarSumario(dados);
            
            contentArea.scrollIntoView({ behavior: 'smooth' });
            showToast('Elementos gerados com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar elementos:', error);
            showToast('Ocorreu um erro. Verifique os dados no console.', 'error');
        }
    });

    // --- GERA A CAPA (Baseado no modelo) ---
    function gerarCapa(d) {
        const subtituloHtml = d.subtitulo ? `<h2 class="subtitulo-trabalho">${d.subtitulo}</h2>` : '';
        return `
            <header class="cabecalho-pagina">
                <p class="maiusculo">${d.instituicao}</p>
                <p class="maiusculo">${d.faculdade}</p>
            </header>
            <main class="conteudo-meio">
                <p class="maiusculo autor-nome">${d.autor}</p>
                <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
                    <h1 class="maiusculo negrito titulo-trabalho">${d.titulo}</h1>
                    ${subtituloHtml}
                </div>
            </main>
            <footer class="rodape-pagina">
                <p class="maiusculo">${d.local}</p>
                <p>${d.ano}</p>
            </footer>
        `;
    }

    // --- GERA A FOLHA DE ROSTO (Baseado no modelo) ---
    function gerarFolhaRosto(d) {
        const subtituloHtml = d.subtitulo ? `<h2 class="subtitulo-trabalho">${d.subtitulo}</h2>` : '';
        const areaConcentracaoHtml = d.area_concentracao ? `<p>Área de Concentração: ${d.area_concentracao}</p>` : '';
        const coorientadorHtml = d.coorientador ? `<p>Coorientador(a): ${d.coorientador}</p>` : '';

        const notaApresentacao = `${d.tipo_trabalho} apresentada à Universidade Estadual Paulista (UNESP), ${d.faculdade}, para obtenção do título de ${d.grau_academico} em ${d.curso}.`;

        return `
            <header class="cabecalho-pagina">
                <p class="maiusculo">${d.autor}</p>
            </header>
            <main class="conteudo-meio">
                 <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
                    <h1 class="maiusculo negrito titulo-trabalho">${d.titulo}</h1>
                    ${subtituloHtml}
                </div>
                <div class="nota-apresentacao">
                    <p>${notaApresentacao}</p>
                    ${areaConcentracaoHtml}
                    <p>Orientador(a): ${d.orientador}</p>
                    ${coorientadorHtml}
                </div>
            </main>
            <footer class="rodape-pagina">
                <p class="maiusculo">${d.local}</p>
                <p>${d.ano}</p>
            </footer>
        `;
    }

    // --- GERA O SUMÁRIO (Baseado no modelo e NBR 6027) ---
    function gerarSumario(d) {
        let sumarioHtml = '<h1 class="titulo-sumario maiusculo">SUMÁRIO</h1>';
        const linhas = d.sumario.split('\n').filter(l => l.trim() !== '');

        if (linhas.length === 0) {
            sumarioHtml += '<p class="sem-sumario">Nenhum item de sumário fornecido.</p>';
            return sumarioHtml;
        }

        linhas.forEach(linha => {
            const partes = linha.split(';');
            if (partes.length < 2) return;
            
            const tituloCompleto = partes[0].trim();
            const pagina = partes[1].trim();
            const ehNumerado = /^\d/.test(tituloCompleto);

            if (ehNumerado) {
                const nivel = (tituloCompleto.split(' ')[0].match(/\./g) || []).length + 1;
                sumarioHtml += `
                    <div class="sumario-item sumario-item-numerado nivel-${nivel}">
                        <span class="titulo">${tituloCompleto}</span>
                        <span class="preenchimento-pontilhado"></span>
                        <span class="pagina-num">${pagina}</span>
                    </div>
                `;
            } else { // Não numerado (Ex: INTRODUÇÃO, REFERÊNCIAS, APÊNDICE)
                sumarioHtml += `
                    <div class="sumario-item sumario-item-sem-numero">
                        <span class="titulo">${tituloCompleto}</span>
                        <span class="preenchimento-pontilhado"></span>
                        <span class="pagina-num">${pagina}</span>
                    </div>
                `;
            }
        });

        return sumarioHtml;
    }

    // --- BOTÕES DE AÇÃO ---
    document.getElementById('btn-imprimir').addEventListener('click', () => {
        if (capaOutput.innerHTML.trim() !== '') {
            window.print();
        } else {
            showToast('Gere os elementos antes de imprimir!', 'warning');
        }
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
        form.reset();
        [capaOutput, folhaRostoOutput, sumarioOutput].forEach(el => el.innerHTML = '');
        form.querySelectorAll('.erro').forEach(el => el.classList.remove('erro'));
        showToast('Formulário limpo!');
    });
    
    // VALIDAÇÃO EM TEMPO REAL
    form.querySelectorAll('input[required], textarea[required]').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('erro');
            }
        });
    });
});