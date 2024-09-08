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

    // Verifica se o bioma do recinto é compatível com o animal
    verificarBioma(especie, recinto) {
        return especie.biomas.some(bioma => recinto.bioma.includes(bioma));
    }

    // Verifica regras para carnívoros no recinto
    verificarCarnivoros(especie, recinto, animal) {
        const recintoTemCarnivoros = recinto.animaisExistentes.some(bicho => this.animais[bicho.especie].carnivoro);
        const recintoTemNaoCarnivoros = recinto.animaisExistentes.some(bicho => !this.animais[bicho.especie].carnivoro);
        const especieCarnivora = especie.carnivoro;

        // Regras de convivência entre carnívoros e não-carnívoros
        if (especieCarnivora && recintoTemNaoCarnivoros) return false;
        if (especieCarnivora && recintoTemCarnivoros) {
            const carnivorosDaMesmaEspecie = recinto.animaisExistentes.every(bicho => bicho.especie === animal);
            if (!carnivorosDaMesmaEspecie) return false;
        }
        if (!especieCarnivora && recintoTemCarnivoros) return false;

        return true;
    }

    // Verifica se hipopótamos podem conviver com outros animais
    verificarHipopotamos(animal, recinto) {
        if (animal.toUpperCase() === 'HIPOPOTAMO' && recinto.animaisExistentes.length > 0) {
            return recinto.bioma === 'savana e rio';
        }
        return true;
    }

    // Verifica se o macaco está sozinho em um recinto vazio
    verificarMacacoSozinho(animal, quantidade, recinto) {
        if (animal.toUpperCase() === 'MACACO' && quantidade === 1 && recinto.animaisExistentes.length === 0) {
            return false;
        }
        return true;
    }

    // Calcula o espaço ocupado e disponível no recinto
    calcularEspaco(recinto, quantidade, tamanhoAnimal) {
        const espacoOcupado = recinto.animaisExistentes.reduce((acc, bicho) => acc + (bicho.tamanho * bicho.quantidade), 0);
        const haMaisDeUmaEspecie = recinto.animaisExistentes.some(bicho => bicho.especie !== 'MACACO');
        const espacoExtra = haMaisDeUmaEspecie ? 1 : 0;
        const espacoDisponivel = recinto.tamanhoTotal - espacoOcupado - espacoExtra;
        const espacoNecessario = quantidade * tamanhoAnimal;
        return espacoDisponivel >= espacoNecessario;
    }

    // Analisa se os recintos são viáveis para o animal e sua quantidade
    analisaRecintos(animal, quantidade) {
        const especie = this.animais[animal.toUpperCase()];
        if (!especie) return { erro: "Animal inválido" };
        if (quantidade <= 0) return { erro: "Quantidade inválida" };

        const recintosViaveis = this.recintos.filter(recinto => {
            const biomaCompativel = this.verificarBioma(especie, recinto);
            if (!biomaCompativel) return false;

            if (!this.verificarCarnivoros(especie, recinto, animal)) return false;
            if (!this.verificarHipopotamos(animal, recinto)) return false;
            if (!this.verificarMacacoSozinho(animal, quantidade, recinto)) return false;

            return this.calcularEspaco(recinto, quantidade, especie.tamanho);
        });

        if (recintosViaveis.length === 0) return { erro: "Não há recinto viável" };

        const recintosFormatados = recintosViaveis.sort((a, b) => a.numero - b.numero).map(recinto => {
            const espacoOcupado = recinto.animaisExistentes.reduce((acc, bicho) => acc + (bicho.tamanho * bicho.quantidade), 0);
            const haMaisDeUmaEspecie = recinto.animaisExistentes.some(bicho => bicho.especie !== animal);
            const espacoExtra = haMaisDeUmaEspecie ? 1 : 0;
            const espacoDisponivel = recinto.tamanhoTotal - espacoOcupado - espacoExtra;
            return `Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel - quantidade * especie.tamanho} total: ${recinto.tamanhoTotal})`;
        });

        return { recintosViaveis: recintosFormatados };
    }
}

export { RecintosZoo as RecintosZoo };
