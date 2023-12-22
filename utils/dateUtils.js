export function getFormattedDate() {
    let now = new Date();
    now.setHours(now.getHours() + 0); // Ajuster pour le fuseau horaire de Paris
  
    let day = String(now.getDate()).padStart(2, '0');
    let month = String(now.getMonth() + 1).padStart(2, '0');
    let year = now.getFullYear();
    let hour = String(now.getHours()).padStart(2, '0');
    let minute = String(now.getMinutes()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hour}:${minute}`;
  }
  