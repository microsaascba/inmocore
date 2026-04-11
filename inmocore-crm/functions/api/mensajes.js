export async function onRequestGet(context) {
    const url = new URL(context.request.url);
    const user1 = url.searchParams.get('u1');
    const user2 = url.searchParams.get('u2');
    
    try {
        // Traemos los últimos 50 mensajes entre estos dos usuarios, ordenados por fecha
        const { results } = await context.env.DB.prepare(
            "SELECT * FROM Mensajes WHERE (remitente = ? AND destinatario = ?) OR (remitente = ? AND destinatario = ?) ORDER BY fecha ASC LIMIT 50"
        ).bind(user1, user2, user2, user1).all();
        
        return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}

export async function onRequestPost(context) {
    try {
        const data = await context.request.json();
        await context.env.DB.prepare(
            "INSERT INTO Mensajes (remitente, destinatario, mensaje) VALUES (?, ?, ?)"
        ).bind(data.remitente, data.destinatario, data.mensaje).run();
        
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}
