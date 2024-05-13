const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

function obtenerPokemonAPI(URL) {
    return fetch (URL)
    .then((r) => r.json())
}

function arrayOffset() {
    const offset = [];
    for (let i = 0; i <= 1300; i = i + 20) {
        offset.push(i);
    }
    return offset;
}

function mostrarCantidadPokemons() {
    obtenerPokemonAPI(BASE_URL)
    .then((r) => document.getElementById('cantidadPokemon').innerText = r.count);
}

function mostrarRetroceder() {
    const $indice = document.getElementById('indices');
    const anterior = document.createElement('td');
    anterior.innerText = '<';
    anterior.classList.add('btn', 'border');
    anterior.addEventListener('click', () => {
        const $activo = document.querySelector('.active');
        const $backURL = $activo.dataset.previous;
        if ($backURL === 'null') return;
        if ($activo) $activo.classList.remove('active', 'bg-primary');
        document.getElementsByClassName('btn')[$activo.dataset.indicePrev].classList.add('active', 'bg-primary');
        actualizarInfoIndice($backURL);
        mostrarPokemones($backURL);
    });
    $indice.append(anterior);
}

function mostrarAvanzar() {
    const $indice = document.getElementById('indices');
    const avanzar = document.createElement('td');
    avanzar.innerText = '>';
    avanzar.classList.add('btn', 'border');
    avanzar.addEventListener('click', () => {
        const $activo = document.querySelector('.active');
        const $nextURL = $activo.dataset.next;
        if ($nextURL === 'null') return;
        if ($activo) $activo.classList.remove('active', 'bg-primary');
        document.getElementsByClassName('btn')[$activo.dataset.indiceSig].classList.add('active', 'bg-primary');
        actualizarInfoIndice($nextURL);
        mostrarPokemones($nextURL);
    });
    $indice.append(avanzar); 
}

function mostrarAvanzarRetroceder() {
    mostrarRetroceder();
    mostrarAvanzar();
}

function mostrarIndices() {
    const $indice = document.getElementById('indices');
    for (let i = 0; i < 66; i++) {
        const td = document.createElement('td');
        td.innerText = i + 1;
        td.classList.add('btn', 'border');
        td.dataset.offset = arrayOffset()[i];
        td.dataset.indiceSig = i + 1;
        td.dataset.indicePrev = i - 1;
        td.addEventListener('click', () => {
            const $activo = document.querySelector('.active');
            if ($activo) $activo.classList.remove('active', 'bg-primary');           
            td.classList.add('active', 'bg-primary');
            const URL = (`${BASE_URL}/?offset=${td.dataset.offset}&limit=20`);
            mostrarPokemones(URL);
            actualizarInfoIndice(URL);
        });
        $indice.appendChild(td);
    }
    document.querySelector('.btn').classList.add('active', 'bg-primary');
}

function mostrarPokemones(URL) {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';
    obtenerPokemonAPI(URL)
    .then((r) =>  r.results.forEach((element) => {        
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerText = element.name;
        li.dataset.url = element.url;
        li.addEventListener('click', () => {
            const $activo = document.querySelector('.list-group-item.active');
            if ($activo) $activo.classList.remove('active');
            li.classList.add('active');

            mostrarDescripcion(li.dataset.url);
        });
        lista.appendChild(li);
    }));
}

function actualizarInfoIndice(URL) {
    obtenerPokemonAPI(URL).then((r) => {
    const $activo = document.querySelector('.btn.border.active');
    if ($activo) {
        $activo.dataset.next = r.next;
        $activo.dataset.previous = r.previous;
    }
    });
}

function mostrarDescripcion(url) {
    const $descripcion = document.getElementById('descripcion');
    $descripcion.classList.remove('d-none');
    document.getElementById('default').classList.add('d-none');
    const $tipos = document.getElementById('tipos');
    const $habilidades = document.getElementById('habilidades');
    $tipos.innerText = '';
    $habilidades.innerText = '';
    obtenerPokemonAPI(url).then((r) => {
        const nombre = document.getElementById('nombre');
        const img = document.getElementById('pic');
        nombre.innerText = r.name + ' (' + r.id + ')';
        img.src = r.sprites.front_default;
        r.types.forEach((e) => $tipos.innerText += ' ' + e.type.name);
        r.abilities.forEach((e) => $habilidades.innerText += ' ' + e.ability.name);
    });
    mostrarMovimientos(url);
}

function mostrarMovimientos(url) {
    const $movimientos = document.getElementById('movimientos');
    $movimientos.innerHTML = '';
    obtenerPokemonAPI(url)
    .then((r) => r.moves.forEach((e) => {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.setAttribute('scope', 'row');
        th.innerText = e.move.name + ' ';
        const td = document.createElement('td');
        e.version_group_details.forEach((e) => td.innerText += e.version_group.name + ' ');
        tr.appendChild(th);
        tr.appendChild(td);
        $movimientos.appendChild(tr);
     }));
}

function iniciar() {
    mostrarCantidadPokemons();
    mostrarIndices();
    actualizarInfoIndice(BASE_URL);
    mostrarAvanzarRetroceder();
    mostrarPokemones(BASE_URL);
}

iniciar();