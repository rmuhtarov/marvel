

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=0e695b8b8edf6307bb19eb648cd862fe';
    _baseOffsetChar = 0;

    getResources = async (url) => {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Could not fetch ${url}, status: ${response.status}`);
        }

        return await response.json();
    }

    getAllCharacters = async (offset = this._baseOffsetChar) => {
        const res = await this.getResources(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);

        return res.data.results.map(this._tranformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResources(`${this._apiBase}characters/${id}?${this._apiKey}`);

        return this._tranformCharacter(res.data.results[0]);
    }

    _tranformCharacter = (char) => {
        return ({
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 250)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        });
    }
}

export default MarvelService;