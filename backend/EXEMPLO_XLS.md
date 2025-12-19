# 📊 Formato do Arquivo XLS para Importação

## Colunas Obrigatórias

O arquivo Excel deve conter **pelo menos** estas colunas:

| Coluna | Obrigatório | Descrição | Exemplo |
|--------|-------------|-----------|---------|
| `codigo_doador` | ✅ Sim | Código único do doador | `1234567891` |
| `nome_completo` ou `nome` | ✅ Sim | Nome completo do doador | `João Silva Santos` |
| `tipo_sanguineo` ou `tipo_sangue` | ✅ Sim | Tipo sanguíneo | `O+`, `A-`, `B+`, `AB-` |

## Colunas Opcionais

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| `data_nascimento` | Data de nascimento | `15/03/1990` ou `1990-03-15` |
| `sexo` | Sexo (M/F) | `M` ou `F` ou `Masculino` ou `Feminino` |
| `telefone` ou `celular` | Telefone | `(81) 99999-9999` |
| `email` | Email | `joao@example.com` |
| `cpf` | CPF | `123.456.789-00` |
| `rg` | RG | `1234567` |
| `endereco` | Endereço completo | `Rua das Flores, 123` |
| `cidade` | Cidade | `Recife` |
| `estado` | Estado (UF) | `PE` |
| `cep` | CEP | `52000-000` |

## Exemplo de Arquivo Excel
a
```
codigo_doador | nome_completo      | tipo_sanguineo | data_nascimento | sexo | telefone        | email
--------------|-------------------|----------------|-----------------|------|-----------------|------------------
1234567891    | João Silva Santos  | O+             | 15/03/1990      | M    | (81) 99999-9999 | joao@example.com
9876543210    | Maria Oliveira     | A-             | 20/07/1985      | F    | (81) 88888-8888 | maria@example.com
5555555555    | Pedro Costa        | B+             | 10/12/1995      | M    | (81) 77777-7777 | pedro@example.com
```

## Formatos Aceitos de Data

O sistema aceita os seguintes formatos de data:

- `DD/MM/YYYY` - Ex: `15/03/1990`
- `DD-MM-YYYY` - Ex: `15-03-1990`
- `YYYY-MM-DD` - Ex: `1990-03-15`
- Número serial do Excel (convertido automaticamente)

## Formatos Aceitos de Sexo

- `M` ou `Masculino` ou `MALE` → `M`
- `F` ou `Feminino` ou `FEMALE` → `F`

## Observações Importantes

1. **Código do Doador**: Deve ser único. Se o código já existir, o registro será atualizado.

2. **Nome das Colunas**: O sistema tenta encontrar colunas com variações de nome:
   - `nome_completo` ou `nome` → ambos funcionam
   - `tipo_sanguineo` ou `tipo_sangue` → ambos funcionam
   - `telefone` ou `celular` → ambos funcionam

3. **Case Insensitive**: Os nomes das colunas não são sensíveis a maiúsculas/minúsculas.

4. **Duplicatas**: Se um `codigo_doador` já existir, os dados serão atualizados (não criará duplicata).

5. **Validação**: Linhas com `codigo_doador` vazio serão ignoradas e registradas no log de erros.

## Processamento

Quando você faz upload de um arquivo:

1. O sistema lê todas as linhas do arquivo
2. Valida cada linha
3. Cria ou atualiza registros na tabela `donors`
4. Gera um log com:
   - Total de linhas processadas
   - Quantidade de sucessos
   - Quantidade de falhas
   - Detalhes dos erros (se houver)

## Exemplo de Resposta do Upload

```json
{
  "success": true,
  "message": "Arquivo processado com sucesso",
  "data": {
    "total_rows": 100,
    "successful_imports": 95,
    "failed_imports": 5,
    "errors": [
      {
        "row": 10,
        "codigo_doador": "1234567891",
        "error": "Nome completo é obrigatório"
      },
      {
        "row": 25,
        "codigo_doador": "N/A",
        "error": "Código do doador é obrigatório"
      }
    ]
  }
}
```



