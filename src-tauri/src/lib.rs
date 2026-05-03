#[derive(serde::Serialize)]
struct AgentEvent {
    kind: String,
    content: String,
}

#[tauri::command]
async fn run_agent(prompt: String) -> Result<Vec<AgentEvent>, String> {
    Ok(vec![
        AgentEvent {
            kind: "status".into(),
            content: format!("Received prompt: {}", prompt),
        },
        AgentEvent {
            kind: "tool".into(),
            content: "Generated ContentView.swift".into(),
        },
        AgentEvent {
            kind: "agent".into(),
            content: "Done. The first version is ready.".into(),
        },
    ])
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![run_agent])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
