export async function onRequestGet(context) {
    try {
        const { results } = await context.env.DB.prepare("SELECT * FROM Leads").all();
        // Transformamos el texto JSON en un Array real para que la web pueda leerlo
        const leadsFormateados = results.map(l => ({ ...l, notas: l.notas ? JSON.parse(l.notas) : [] }));
        return new Response(JSON.stringify({ leads: leadsFormateados, contactos: [] }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}

export async function onRequestPost(context) {
    try {
        const data = await context.request.json();
        await context.env.DB.prepare(
            "INSERT INTO Leads (id, nombre, telefono, prop_id, agente_id, estado, fecha_ingreso, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(data.id, data.nombre, data.telefono, data.prop_id, data.agente_id, data.estado, data.fecha_ingreso, JSON.stringify(data.notas || [])).run();
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}

export async function onRequestPut(context) {
    try {
        const id = new URL(context.request.url).searchParams.get('id');
        const data = await context.request.json();
        
        if (data.notas !== undefined) {
            await context.env.DB.prepare("UPDATE Leads SET estado=?, notas=? WHERE id=?").bind(data.estado, JSON.stringify(data.notas), id).run();
        } else {
            await context.env.DB.prepare("UPDATE Leads SET estado=? WHERE id=?").bind(data.estado, id).run();
        }
        return new Response(JSON.stringify({ok: true}));
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}
