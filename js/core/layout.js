export function layoutShell(content){
  document.getElementById("app").innerHTML = `
    <div class='app-shell'>
      ${content}
    </div>
  `;
}
