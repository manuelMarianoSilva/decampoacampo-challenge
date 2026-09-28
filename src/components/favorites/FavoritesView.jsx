import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetGenerations } from "../../hooks/useGetGenerations";
import { favoriteMoved, MAX_FAVORITES } from "../../store/favoritesSlice";
import { FavoriteCard } from "./FavoriteCard.jsx";
import { useNavigate } from "react-router-dom";
import backArrow from "../../assets/images/back_arrow.svg";
import sadAsh from "../../assets/images/sad_ash.png";
import styles from "./FavoritesView.module.css";

const FavoriteSlot = ({ slotIndex, pokemonId, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `favorite-slot-${slotIndex}`,
    data: { slotIndex },
    disabled: pokemonId !== null,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.slot} ${isOver ? styles.slotOver : ""}`}
    >
      {children}
    </div>
  );
};

const slotCollisionDetection = (args) => {
  if (args.pointerCoordinates) return pointerWithin(args);
  return closestCenter(args);
};

export const FavoritesView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favoriteIds = useSelector((state) => state.favorites.ids);
  const { generations } = useGetGenerations();
  const didDragRef = useRef(false);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    useSensor(KeyboardSensor),
  );
  const slots = Array.from(
    { length: MAX_FAVORITES },
    (_, index) => favoriteIds[index] ?? null,
  );

  const resetDragState = () => {
    window.setTimeout(() => {
      didDragRef.current = false;
    }, 0);
  };

      const navigateBack = () => {
        navigate( "/")
    }

  const handleDragEnd = ({ active, over }) => {
    if (over) {
      const pokemonId = active.data.current?.pokemonId;
      const targetSlot = over.data.current?.slotIndex;

      if (pokemonId != null && Number.isInteger(targetSlot)) {
        dispatch(favoriteMoved({ pokemonId, targetSlot }));
      }
    }

    resetDragState();
  };
  
  return (
    <main className={styles.view}>
              <div className={styles.backButtonContainer}>
                        <button onClick={navigateBack} className={styles.backButton}>
                            <img src={backArrow} alt="Back" width={24} height={24} />
                        </button>
                    </div>
      <h1 className={styles.title}>My Team</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={slotCollisionDetection}
        onDragStart={() => {
          didDragRef.current = true;
        }}
        onDragEnd={handleDragEnd}
        onDragCancel={resetDragState}
      >
        {slots.some(slot => slot !== null) ?(<section className={styles.grid} aria-label="Favorite Pokémon">
          {slots.map((id, index) => (
            <FavoriteSlot key={`favorite-slot-${index}`} slotIndex={index} pokemonId={id}>
              {id ? (
                <FavoriteCard
                  pokemonId={id}
                  slotIndex={index}
                  generation={generations?.[id]}
                  didDragRef={didDragRef}
                />
              ) : (
                <div className={styles.emptySlot} aria-label="Empty favorite slot">
                  <span>Empty slot</span>
                </div>
              )}
            </FavoriteSlot>
          ))}
        </section>) : (
            <div>
                <img src={sadAsh} alt="Sad Ash" className={styles.sadAsh} />
                <p>It's a desert around here!!!</p>
                <p>Go back to the Pokedex and pick some favorites!</p>
            </div>
            )}
      </DndContext>
    </main>
  );
};
