import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router"
import {
    useGetPokemonByIdQuery,
    useGetPokemonsPaginatedQuery,
} from "../../services/pokemonApi"
import backArrow from "../../assets/images/back_arrow.svg"
import trainer from "../../assets/images/trainer.png"
import styles from "./CompareView.module.css"

const CATALOG_LIMIT = 2000
const FORM_RESOURCE_ID_START = 10000
const MAX_STAT_VALUE = 255

const STAT_ROWS = [
    { name: "hp", label: "HP" },
    { name: "attack", label: "Attack" },
    { name: "defense", label: "Defense" },
    { name: "special-attack", label: "Special Attack" },
    { name: "special-defense", label: "Special Defense" },
    { name: "speed", label: "Speed" },
]

const validationSchema = Yup.object({
    firstPokemon: Yup.string().required("Select a Pokémon."),
    secondPokemon: Yup.string()
        .required("Select a Pokémon.")
        .notOneOf([Yup.ref("firstPokemon")], "Choose a different Pokémon."),
})

const getPokemonId = (url) => Number(url.match(/\/(\d+)\/?$/)?.[1])

const formatName = (name) =>
    name
        .split("-")
        .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join(" ")

const SearchablePokemonSelect = ({
    field,
    label,
    options,
    value,
    error,
    touched,
    onChange,
    onSelect,
}) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const selectedPokemon = options.find((pokemon) => String(pokemon.id) === value)
    const displayedValue = searchTerm || selectedPokemon?.name || ""
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const suggestions = normalizedSearch
        ? options
            .filter((pokemon) => pokemon.name.includes(normalizedSearch))
            .slice(0, 8)
        : []
    const listId = `${field}-options`

    return (
        <div className={styles.selector}>
            <label className={styles.selectorLabel} htmlFor={field}>
                {label}
            </label>
            <div className={styles.inputWrap}>
                <input
                    id={field}
                    type="search"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={isOpen && suggestions.length > 0}
                    aria-controls={listId}
                    aria-invalid={Boolean(touched && error)}
                    aria-describedby={touched && error ? `${field}-error` : undefined}
                    autoComplete="off"
                    placeholder="Search Pokémon"
                    value={displayedValue}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setIsOpen(false)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && suggestions[0]) {
                            event.preventDefault()
                            onSelect(String(suggestions[0].id))
                            setSearchTerm(suggestions[0].name)
                            setIsOpen(false)
                        }
                    }}
                    onChange={(event) => {
                        const nextSearchTerm = event.target.value
                        const exactMatch = options.find(
                            (pokemon) => pokemon.name === nextSearchTerm.trim().toLowerCase(),
                        )
                        setSearchTerm(nextSearchTerm)
                        onChange(exactMatch ? String(exactMatch.id) : "")
                        setIsOpen(true)
                    }}
                />
                {isOpen && suggestions.length > 0 && (
                    <ul className={styles.suggestions} id={listId} role="listbox">
                        {suggestions.map((pokemon) => (
                            <li key={pokemon.id} role="presentation">
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={String(pokemon.id) === value}
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => {
                                        onSelect(String(pokemon.id))
                                        setSearchTerm(pokemon.name)
                                        setIsOpen(false)
                                    }}
                                >
                                    {formatName(pokemon.name)}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                {isOpen && normalizedSearch && suggestions.length === 0 && (
                    <div className={styles.noResults} role="status">
                        No Pokémon found
                    </div>
                )}
            </div>
            {touched && error && (
                <span className={styles.fieldError} id={`${field}-error`}>
                    {error}
                </span>
            )}
        </div>
    )
}

const getStatValue = (pokemon, statName) =>
    pokemon.stats.find(({ stat }) => stat.name === statName)?.base_stat ?? 0

const getArtwork = (pokemon) =>
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.front_default

const PokemonHeading = ({ pokemon }) => (
    <div className={styles.pokemonHeading}>
        {getArtwork(pokemon) ? (
            <img className={styles.pokemonArtwork} src={getArtwork(pokemon)} alt="" />
        ) : (
            <div className={styles.artworkPlaceholder} aria-hidden="true" />
        )}
        <h2>{formatName(pokemon.name)}</h2>
    </div>
)

const StatBar = ({ value, variant }) => (
    <div className={styles.statTrack}>
        <div
            className={`${styles.statFill} ${styles[variant]}`}
            style={{ width: `${Math.min((value / MAX_STAT_VALUE) * 100, 100)}%` }}
        />
    </div>
)

const StatComparison = ({ firstPokemon, secondPokemon }) => (
    <section className={styles.comparison} aria-label="Base stat comparison">
        <div className={styles.pokemonHeadings}>
            <PokemonHeading pokemon={firstPokemon} />
            <span className={styles.versus} aria-hidden="true">VS</span>
            <PokemonHeading pokemon={secondPokemon} />
        </div>
        <div className={styles.statRows}>
            {STAT_ROWS.map(({ name, label }) => {
                const firstValue = getStatValue(firstPokemon, name)
                const secondValue = getStatValue(secondPokemon, name)

                return (
                    <div className={styles.statRow} key={name}>
                        <div className={styles.statSide}>
                            <span className={styles.statValue}>{firstValue}</span>
                            <StatBar value={firstValue} variant="firstFill" />
                        </div>
                        <span className={styles.statLabel}>{label}</span>
                        <div className={styles.statSide}>
                            <span className={styles.statValue}>{secondValue}</span>
                            <StatBar value={secondValue} variant="secondFill" />
                        </div>
                    </div>
                )
            })}
        </div>
    </section>
)

export const CompareView = () => {
    const navigate = useNavigate()
    const {
        currentData: catalog,
        isLoading: isCatalogLoading,
        isFetching: isCatalogFetching,
        error: catalogError,
        refetch: refetchCatalog,
    } = useGetPokemonsPaginatedQuery({ limit: CATALOG_LIMIT, offset: 0 })
    const options = (catalog?.results ?? [])
        .map((pokemon) => ({
            id: getPokemonId(pokemon.url),
            name: pokemon.name,
        }))
        .filter((pokemon) => pokemon.id > 0 && pokemon.id < FORM_RESOURCE_ID_START)
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const formik = useFormik({
        initialValues: { firstPokemon: "", secondPokemon: "" },
        validationSchema,
        onSubmit: () => setHasSubmitted(true),
    })
    const updateSelection = (field, value) => {
        const values = { ...formik.values, [field]: value }
        formik.setValues(values, false)
        if (value || formik.touched[field]) {
            formik.setFieldTouched(field, true, false)
        }
        formik.validateForm(values)
    }
    const isPairSelected = Boolean(
        formik.values.firstPokemon &&
        formik.values.secondPokemon &&
        formik.values.firstPokemon !== formik.values.secondPokemon,
    )
    const firstId = hasSubmitted && isPairSelected ? formik.values.firstPokemon : undefined
    const secondId = hasSubmitted && isPairSelected ? formik.values.secondPokemon : undefined
    const firstQuery = useGetPokemonByIdQuery(firstId, { skip: !firstId })
    const secondQuery = useGetPokemonByIdQuery(secondId, { skip: !secondId })
    const firstPokemon = firstQuery.currentData
    const secondPokemon = secondQuery.currentData
    const comparisonLoading = firstQuery.isLoading || secondQuery.isLoading
    const comparisonError = firstQuery.error || secondQuery.error

    const navigateBack = () => {
        navigate("/")
    }

    return (
        <main className={styles.view}>
            <div className={styles.content}>
                <button className={styles.backButton} type="button" onClick={navigateBack}>
                    <img src={backArrow} alt="Back" width={24} height={24} />
                </button>
                <header className={styles.header}>
                    <p className={styles.eyebrow}>Trainer's toolkit</p>
                    <h1 className={styles.title}>Compare Pokémon</h1>
                </header>

                {isCatalogLoading ? (
                    <div className={styles.catalogMessage} role="status" aria-live="polite">
                        <span className={styles.loadingMark} aria-hidden="true" />
                        Loading Pokémon for comparison…
                    </div>
                ) : catalogError ? (
                    <div className={styles.catalogMessage} role="alert">
                        <span>Pokémon could not be loaded.</span>
                        <button className={styles.textButton} type="button" onClick={refetchCatalog}>
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        {isCatalogFetching && (
                            <p className={styles.refreshMessage} role="status">
                                Updating Pokémon options…
                            </p>
                        )}
                        <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
                            <SearchablePokemonSelect
                                field="firstPokemon"
                                label="First Pokémon"
                                options={options}
                                value={formik.values.firstPokemon}
                                error={formik.errors.firstPokemon}
                                touched={formik.touched.firstPokemon}
                                onChange={(value) => updateSelection("firstPokemon", value)}
                                onSelect={(value) => updateSelection("firstPokemon", value)}
                            />
                            <SearchablePokemonSelect
                                field="secondPokemon"
                                label="Second Pokémon"
                                options={options}
                                value={formik.values.secondPokemon}
                                error={formik.errors.secondPokemon}
                                touched={formik.touched.secondPokemon}
                                onChange={(value) => updateSelection("secondPokemon", value)}
                                onSelect={(value) => updateSelection("secondPokemon", value)}
                            />
                            <div className={styles.formAction}>
                                <button className={styles.compareButton} type="submit">
                                    Compare stats
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {hasSubmitted && isPairSelected && (
                    comparisonLoading ? (
                        <div className={styles.resultMessage} role="status" aria-live="polite">
                            <span className={styles.loadingMark} aria-hidden="true" />
                            Loading Pokémon stats…
                        </div>
                    ) : comparisonError ? (
                        <div className={styles.resultMessage} role="alert">
                            <span>Stats could not be loaded.</span>
                            <button
                                className={styles.textButton}
                                type="button"
                                onClick={() => {
                                    firstQuery.refetch()
                                    secondQuery.refetch()
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    ) : firstPokemon && secondPokemon ? (
                        <StatComparison firstPokemon={firstPokemon} secondPokemon={secondPokemon} />
                    ) : null
                )}
                {!hasSubmitted && (
                    <div> 
                    <p className={styles.emptyState}>Your comparison will appear here.</p>
                    <img src={trainer} alt="Trainer" className={styles.emptyStateImage} />
                    </div>
                )}
            </div>
        </main>
    )
}