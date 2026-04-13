export async function onRequestGet(context) {
    try {
        // Trae todos los agentes (incluyendo sus contraseñas para que el login funcione)
        const { results } = await context.env.DB.prepare("SELECT * FROM Agentes").all();
        return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}

export async function onRequestPost(context) {
    try {
        const data = await context.request.json();
        // Al crear un agente nuevo, guarda todos los datos incluyendo el password_hash
        await context.env.DB.prepare(
            "INSERT INTO Agentes (id, nombre, email, telefono, direccion, ciudad, provincia, usuario, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(data.id, data.nombre, data.email, data.telefono, data.direccion, data.ciudad, data.provincia, data.usuario, data.password_hash).run();
        
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}

export async function onRequestPut(context) {
    try {
        const id = new URL(context.request.url).searchParams.get('id');
        const data = await context.request.json();
        
        // Si el administrador escribió una nueva contraseña en el modal, la actualizamos
        if(data.password_hash) {
            await context.env.DB.prepare(
                "UPDATE Agentes SET nombre=?, email=?, telefono=?, direccion=?, ciudad=?, provincia=?, usuario=?, password_hash=? WHERE id=?"
            ).bind(data.nombre, data.email, data.telefono, data.direccion, data.ciudad, data.provincia, data.usuario, data.password_hash, id).run();
        } else {
            // Si el campo contraseña quedó vacío al editar, actualizamos todo MENOS la contraseña
            await context.env.DB.prepare(
                "UPDATE Agentes SET nombre=?, email=?, telefono=?, direccion=?, ciudad=?, provincia=?, usuario=? WHERE id=?"
            ).bind(data.nombre, data.email, data.telefono, data.direccion, data.ciudad, data.provincia, data.usuario, id).run();
        }
        
        return new Response(JSON.stringify({ok: true}));
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}

export async function onRequestDelete(context) {
    try {
        const id = new URL(context.request.url).searchParams.get('id');
        await context.env.DB.prepare("DELETE FROM Agentes WHERE id=?").bind(id).run();
        return new Response(JSON.stringify({ok: true}));
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}
