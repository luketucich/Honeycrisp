use std::path::Path;
use std::process::Command;

#[derive(serde::Deserialize, serde::Serialize)]
struct AgentEvent {
    kind: String,
    content: String,
}

#[tauri::command]
async fn run_agent(prompt: String) -> Result<Vec<AgentEvent>, String> {
    let project_root = Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .ok_or("Could not find project root")?;

    let tsx_path = project_root.join("node_modules").join(".bin").join("tsx");
    let output = Command::new(tsx_path)
        .current_dir(project_root)
        .args(["agent/devRunner.ts", prompt.as_str()])
        .output()
        .map_err(|error| format!("Failed to run agent backend: {error}"))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Agent backend failed: {stderr}"));
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    stdout
        .lines()
        .filter(|line| !line.trim().is_empty())
        .map(|line| {
            serde_json::from_str::<AgentEvent>(line)
                .map_err(|error| format!("Failed to parse agent event: {error}"))
        })
        .collect()
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
