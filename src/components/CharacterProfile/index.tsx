import style from './style.module.css';
import { DisneyCharacterData } from "../../types/DisneyAPI";

interface CharacterProfileProps {
    character: DisneyCharacterData
}

const CharacterProfile = ({ character }: CharacterProfileProps) => {
    if(!character) return null;

    return (
        <div className={style['profile-container']}>
            <div className={style['info']}>
                <img src={character.imageUrl} />
                <div className={style['stats']}>
                    <h2>{character.name}</h2>
                    <span>{character.allies.length} allies</span>
                    <span>{character.enemies.length} enemies</span>
                    <span>{character.parkAttractions.length} park attractions</span>
                </div>   
            </div>

            <h3>TV shows</h3>
            {
                character.tvShows.length
                ? <ul className={style['tv-shows']}>
                    {character?.tvShows.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                : <span className={`${style['tv-shows']} ${style['none']}`}>None</span>
            }
                
            <h3>Video games</h3>
            {
                character.videoGames.length
                ? <ul className={style['video-games']}>
                    {character.videoGames.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                : <span className={`${style['video-games']} ${style['none']}`}>None</span>
            }
        </div>
    )
}

export default CharacterProfile;