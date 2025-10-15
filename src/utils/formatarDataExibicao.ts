export default function formatarDataExibicao(data: string){
    return `${new Date(data).toLocaleDateString()} às ${new Date(data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}