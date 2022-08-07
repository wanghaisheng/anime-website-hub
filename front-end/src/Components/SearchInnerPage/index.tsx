import React, { useRef, useState } from 'react'
import * as C from './styles'
import { ReactComponent as SearchSvg } from '../../imgs/svg/search.svg'
import { ReactComponent as LoadingSvg } from '../../imgs/svg/Spinner-1s-200px.svg'
import API from '../../API/anilist'
import gogoAnime from '../../API/gogo-anime'
import { Link } from 'react-router-dom'

export default function SearchInnerPage() {

    const searchInput: any = useRef()

    const [aniListSearchResults, setAniListSearchResults] = useState([null])
    const [gogoSearchResults, setGogoSearchResults] = useState([null])
    const [resultsWasFetched, setResultsWasFetched] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()

        if (searchInput.current.value.length > 0) {
            setLoading(true)
            setResultsWasFetched(false)

            const dataAni = await API.getSeachResults(searchInput.current.value)
            const dataGogo = await gogoAnime.searchMedia(searchInput.current.value)
            setAniListSearchResults(dataAni)
            setGogoSearchResults(dataGogo)

            setResultsWasFetched(true)
            setLoading(false)
        }

    }

    const clearSearchResults = () => {
        setResultsWasFetched(false)
    }

    return (
        <>
            <C.Search hasText={searchInput}>

                <form onSubmit={(e) => handleSearch(e)}>
                    <div>
                        <label htmlFor='search-input' />
                        {loading === false && <SearchSvg id='input-svg' />}
                        {loading === true && <LoadingSvg id='input-loading-svg' />}
                        <input id='search-input' type='text' placeholder='Search' ref={searchInput}></input>
                        <button type='submit'>{' '}<SearchSvg /></button>
                    </div>
                </form>

            </C.Search >

            {resultsWasFetched === true && (
                <C.SearchResults>

                    <div className='heading-search-results'>
                        <h1>Results For {searchInput.current.value}</h1>
                        <button type='button' onClick={() => clearSearchResults()}>Clear</button>
                    </div>

                    {aniListSearchResults[0] != null && (
                        <>
                            {
                                aniListSearchResults.map((item: any, key) => (

                                    <div key={key} className='result-item'>
                                        <Link to={`/anime/${item.id}`}>
                                            {item.coverImage && (
                                                <img src={item.coverImage.medium} alt={`${item.title.romaji} Cover`}>
                                                </img>
                                            )}
                                            <div className='item-info'>
                                                {item.title.romaji && (
                                                    <h2>
                                                        {item.title.romaji.slice(0, 20)}
                                                    </h2>
                                                )}
                                                {item.title.native && (
                                                    <h3>
                                                        {item.title.native.slice(0, 20)}
                                                    </h3>
                                                )}
                                                {item.startDate.year && (
                                                    <p>{item.startDate.year}</p>
                                                )}
                                                {item.genres && (
                                                    <ul>
                                                        {item.genres.slice(0, 3).map((genre: any) => (
                                                            <li>{genre}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                                {item.format && (
                                                    <p>{item.format}</p>
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            }
                        </>
                    )}

                    {gogoSearchResults[0] != null && (
                        <>
                            {
                                gogoSearchResults.slice(0, 5).map((item: any, key) => (

                                    <div key={key} className='result-item'>
                                        <Link to={`/anime/v2/${item.animeId && item.animeId}`}>
                                            {item.animeImg && (
                                                <img src={item.animeImg} alt={`${item.animeTitle} Cover`}>
                                                </img>
                                            )}
                                            <div className='item-info'>
                                                {item.animeTitle && (
                                                    <h2>
                                                        {item.animeTitle.slice(0, 20)}
                                                    </h2>
                                                )}
                                                <h3>GogoAnime</h3>
                                                {item.status && (
                                                    <p>{item.status}</p>
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            }
                        </>
                    )
                    }

                </C.SearchResults >
            )}
        </>
    )
}

