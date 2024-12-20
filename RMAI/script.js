function showInfo(type) {
    const descriptions = {
        "Patents": "Patents protect inventions, granting exclusive rights to the inventor to prevent others from making, using, or selling the invention without permission.",
        "Copyrights": "Copyrights protect creative works such as books, music, and films, ensuring the creator's exclusive rights over reproduction and distribution.",
        "Trademarks": "Trademarks protect logos, symbols, names, and brands used to identify goods or services.",
        "Trade Secrets": "Trade secrets protect confidential business information, such as recipes or processes, that provide a competitive advantage."
    };

    document.getElementById("info-title").textContent = type;
    document.getElementById("info-description").textContent = descriptions[type];
    document.getElementById("info-overlay").classList.remove("hidden");
}

function closeInfo() {
    document.getElementById("info-overlay").classList.add("hidden");
}
