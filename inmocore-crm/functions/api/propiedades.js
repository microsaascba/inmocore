export async function onRequestGet(context) {
    try {
        const { results } = await context.env.DB.prepare("SELECT * FROM Propiedades").all();
        return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}

export async function onRequestPost(context) {
    try {
        const data = await context.request.json();
        await context.env.DB.prepare(
            "INSERT INTO Propiedades (id, nombre, precio, ubicacion, maps, fotos, descripcion, speech, script_wa, destacado, activo, operacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(data.id, data.nombre, data.precio, data.ubicacion, data.maps, data.fotos, data.descripcion, data.speech, data.script_wa, data.destacado ? 1 : 0, data.activo ? 1 : 0, data.operacion).run();
        
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}

export async function onRequestPut(context) {
    try {
        const id = new URL(context.request.url).searchParams.get('id');
        const data = await context.request.json();
        await context.env.DB.prepare(
            "UPDATE Propiedades SET nombre=?, precio=?, ubicacion=?, script_wa=?, descripcion=?, fotos=?, destacado=?, activo=?, operacion=? WHERE id=?"
        ).bind(data.nombre, data.precio, data.ubicacion, data.script_wa, data.descripcion, data.fotos, data.destacado ? 1 : 0, data.activo ? 1 : 0, data.operacion, id).run();
        
        return new Response(JSON.stringify({ok: true}));
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}

export async function onRequestDelete(context) {
    try {
        const id = new URL(context.request.url).searchParams.get('id');
        await context.env.DB.prepare("DELETE FROM Propiedades WHERE id=?").bind(id).run();
        return new Response(JSON.stringify({ok: true}));
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}
