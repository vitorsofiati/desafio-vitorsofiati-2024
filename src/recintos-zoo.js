class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'MACACO', quantidade: 3, tamanho: 1 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [{ especie: 'GAZELA', quantidade: 1, tamanho: 2 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'LEAO', quantidade: 1, tamanho: 3 }] },
        ];

        this.animais = {
            'LEAO': { tamanho: 3, biomas: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, biomas: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, biomas: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, biomas: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        const especie = this.animais[animal.toUpperCase()];
        // Verificações de input
        if (!especie) return { erro: "Animal inválido" };
        if (quantidade <= 0) return { erro: "Quantidade inválida" };
    
        console.log(`Analisando recintos para ${animal} (quantidade: ${quantidade})`);
    
        let recintosViaveis = this.recintos.filter(recinto => {
// Verificar compatibilidade de bioma
            const biomaCompativel = especie.biomas.some(bioma => recinto.bioma.includes(bioma));

            console.log(`Recinto ${recinto.numero}: Bioma compatível?`, biomaCompativel);
            if (!biomaCompativel) return false;

    
            // Verificar presença de carnívoros e não-carnívoros no recinto
            const recintoTemCarnivoros = recinto.animaisExistentes.some(bicho => this.animais[bicho.especie].carnivoro);
            const recintoTemNaoCarnivoros = recinto.animaisExistentes.some(bicho => !this.animais[bicho.especie].carnivoro);
            const especieCarnivora = especie.carnivoro;
    
            // Se o recinto tiver não-carnívoros e o animal for carnívoro, rejeitar
            if (especieCarnivora && recintoTemNaoCarnivoros) {
                console.log(`Recinto ${recinto.numero}: Não é possível misturar carnívoros com não-carnívoros.`);
                return false;
            }

            if (especieCarnivora && recintoTemCarnivoros) {
                // Verificar se todos os carnívoros no recinto são da mesma espécie que o animal sendo inserido
                const carnivorosDaMesmaEspecie = recinto.animaisExistentes.every(bicho => 
                    this.animais[bicho.especie].carnivoro && bicho.especie === animal
                );
            
                if (!carnivorosDaMesmaEspecie) {
                    console.log(`Recinto ${recinto.numero}: Não é possível misturar carnívoros de espécies diferentes.`);
                    return false;
                }
            }
    
            // Se o recinto tiver carnívoros e o animal for não-carnívoro, rejeitar
            if (!especieCarnivora && recintoTemCarnivoros) {
                console.log(`Recinto ${recinto.numero}: Não é possível misturar carnívoros com ${animal}`);
                return false;
            }

            if (animal.toUpperCase() === 'HIPOPOTAMO' && recinto.animaisExistentes.length > 0) {
                if (recinto.bioma !== 'savana e rio') {
                    console.log(`Recinto ${recinto.numero}: Hipopótamo só aceita convívio com outros animais em bioma savana e rio.`);
                    return false;
                }
            }
    
            const espacoOcupado = recinto.animaisExistentes.reduce((acc, bicho) => acc + (bicho.tamanho * bicho.quantidade), 0);
            console.log(`Recinto ${recinto.numero}: Espaço ocupado: ${espacoOcupado}`);
    
            const haMaisDeUmaEspecie = recinto.animaisExistentes.length > 0 && recinto.animaisExistentes.some(bicho => bicho.especie !== animal);
            console.log(`Recinto ${recinto.numero}: Há mais de uma espécie?`, haMaisDeUmaEspecie);
    
            const espacoExtra = haMaisDeUmaEspecie ? 1 : 0;
            console.log(`Recinto ${recinto.numero}: Espaço extra: ${espacoExtra}`);
    
            const espacoDisponivel = recinto.tamanhoTotal - espacoOcupado - espacoExtra;
            console.log(`Recinto ${recinto.numero}: Espaço disponível: ${espacoDisponivel}`);
    
            const espacoNecessario = quantidade * especie.tamanho;
            console.log(`Recinto ${recinto.numero}: Espaço necessário: ${espacoNecessario}`);
    
            const recintoViavel = biomaCompativel && espacoNecessario <= espacoDisponivel;
            console.log(`Recinto ${recinto.numero}: Recinto viável?`, recintoViavel);
    
            return recintoViavel;
        });
    
        if (recintosViaveis.length === 0) {
            console.log("Erro: Não há recinto viável");
            return { erro: "Não há recinto viável" };
        }
    
        // Ordenar recintos viáveis pelo número do recinto
        recintosViaveis.sort((a, b) => a.numero - b.numero);
        console.log("Recintos viáveis (após ordenação):", recintosViaveis.map(r => r.numero));
    
        // Mapear os recintos viáveis para a saída no formato desejado
        recintosViaveis = recintosViaveis.map(recinto => {
            const espacoOcupado = recinto.animaisExistentes.reduce((acc, bicho) => acc + (bicho.tamanho * bicho.quantidade), 0);
            const haMaisDeUmaEspecie = recinto.animaisExistentes.length > 0 && recinto.animaisExistentes.some(bicho => bicho.especie !== animal);
            const espacoExtra = haMaisDeUmaEspecie ? 1 : 0;
            const espacoDisponivel = recinto.tamanhoTotal - espacoOcupado - espacoExtra;
            return `Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel - quantidade * especie.tamanho} total: ${recinto.tamanhoTotal})`;
        });
    
        console.log("Recintos viáveis (final):", recintosViaveis);
        return { recintosViaveis };
    }        
}

export { RecintosZoo as RecintosZoo };
