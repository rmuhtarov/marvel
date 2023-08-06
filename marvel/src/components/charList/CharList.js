import { Component } from 'react';
import React from 'react';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newCharsLoading: false,
        offset: 9,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequestChar();
    }

    onRequestChar = (offset) => {
        this.onCharListLoading();

        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            newCharsLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newCharsLoading: false,
            offset: offset + 9,
            charEnded: ended
        }));
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    renderCharList(items) {
        const list = items.map(item => {

            let imgStyle = {'objectFit': 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li 
                    onClick={() => this.props.onSelectedChar(item.id)}
                    key={item.id} 
                    className="char__item">
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            );
        });

        return (
            <ul className="char__grid">
                {list}
            </ul>
        );
    }

    render() {
        const {charList, loading, error, newCharsLoading, offset, charEnded} = this.state;

        const characterList = this.renderCharList(charList);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = (!error && loading) ? <Spinner /> : null;
        const content = (!error && !loading) ? characterList : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newCharsLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequestChar(offset)}>
                        <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;