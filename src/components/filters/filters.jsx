import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { TOTAL_GENERATIONS } from "../../utils/constants"
import { typenames } from "../typeBadges/typeIndex.jsx"
import styles from "./filters.module.css"

const readFilters = (searchParams) => ({
	name: searchParams.get("name") ?? "",
	type: searchParams.get("type") ?? "",
	generation: searchParams.get("generation") ?? "",
})

/**
 * Had to go for a custom dropdown implementation because 
 * the native <select> element fell apart when on mobile view.
 */
const FilterDropdown = ({ name, label, options, value, onChange }) => {
	const [isOpen, setIsOpen] = useState(false)
	const controlRef = useRef(null)
	const triggerRef = useRef(null)
	const optionsRef = useRef(null)
	const id = `${name}-filter`
	const selectedOption = options.find((option) => option.value === value) ?? options[0]

	useEffect(() => {
		if (!isOpen) return

		optionsRef.current
			?.querySelector('[aria-selected="true"]')
			?.focus()

		const handlePointerDown = (event) => {
			if (!controlRef.current?.contains(event.target)) setIsOpen(false)
		}

		document.addEventListener("pointerdown", handlePointerDown)
		return () => document.removeEventListener("pointerdown", handlePointerDown)
	}, [isOpen])

	const selectOption = (optionValue) => {
		onChange(name, optionValue)
		setIsOpen(false)
		triggerRef.current?.focus()
	}

	const focusOption = (index) => {
		const optionButtons = optionsRef.current?.querySelectorAll('[role="option"]')
		optionButtons?.[Math.max(0, Math.min(index, optionButtons.length - 1))]?.focus()
	}

	const handleOptionKeyDown = (event) => {
		const currentIndex = Number(event.currentTarget.dataset.optionIndex)

		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault()
			focusOption(currentIndex + (event.key === "ArrowDown" ? 1 : -1))
		} else if (event.key === "Home" || event.key === "End") {
			event.preventDefault()
			focusOption(event.key === "Home" ? 0 : options.length - 1)
		} else if (event.key === "Escape") {
			event.preventDefault()
			setIsOpen(false)
			triggerRef.current?.focus()
		}
	}

	return (
		<div
			className={styles.control}
			ref={controlRef}
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
			}}
		>
			<span id={`${id}-label`}>{label}</span>
			<button
				ref={triggerRef}
				className={styles.dropdownTrigger}
				type="button"
				role="combobox"
				aria-label={`${label}: ${selectedOption.label}`}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-controls={`${id}-options`}
				onClick={() => setIsOpen((open) => !open)}
				onKeyDown={(event) => {
					if (event.key === "ArrowDown" || event.key === "ArrowUp") {
						event.preventDefault()
						setIsOpen(true)
					}
				}}
			>
				<span>{selectedOption.label}</span>
				<span className={styles.dropdownChevron} aria-hidden="true" />
			</button>
			{isOpen && (
				<div
					className={styles.dropdownMenu}
					id={`${id}-options`}
					role="listbox"
					aria-labelledby={`${id}-label`}
					ref={optionsRef}
				>
					{options.map((option, index) => (
						<button
							key={option.value}
							className={styles.dropdownOption}
							type="button"
							role="option"
							aria-selected={option.value === value}
							data-option-index={index}
							onKeyDown={handleOptionKeyDown}
							onClick={() => selectOption(option.value)}
						>
							{option.label}
						</button>
					))}
				</div>
			)}
		</div>
	)
}

export const Filters = ({ onFiltersChange }) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [filters, setFilters] = useState(() => readFilters(searchParams))
	const filtersRef = useRef(filters)
	const searchParamsRef = useRef(searchParams)
	const nameDebounceRef = useRef(null)

	useEffect(() => {
		const currentParams = new URLSearchParams(searchParams)
		if (currentParams.toString() === searchParamsRef.current.toString()) return

		searchParamsRef.current = currentParams
		clearTimeout(nameDebounceRef.current)
		const nextFilters = readFilters(currentParams)
		filtersRef.current = nextFilters
		setFilters(nextFilters)
	}, [searchParams])

	useEffect(() => () => clearTimeout(nameDebounceRef.current), [])

	const updateSearchParam = (name, value) => {
		const nextSearchParams = new URLSearchParams(searchParamsRef.current)
		if (value) {
			nextSearchParams.set(name, value)
		} else {
			nextSearchParams.delete(name)
		}

		searchParamsRef.current = nextSearchParams
		setSearchParams(nextSearchParams, { replace: true })
	}

	const handleChange = (event) => {
		const { name, value } = event.target
		const nextFilters = { ...filtersRef.current, [name]: value }
		filtersRef.current = nextFilters
		setFilters(nextFilters)
		onFiltersChange?.(nextFilters)

		if (name === "name") {
			clearTimeout(nameDebounceRef.current)
			nameDebounceRef.current = setTimeout(() => {
				updateSearchParam("name", filtersRef.current.name)
			}, 300)
		} else {
			updateSearchParam(name, value)
		}
	}

	const handleDropdownChange = (name, value) => {
		const nextFilters = { ...filtersRef.current, [name]: value }
		filtersRef.current = nextFilters
		setFilters(nextFilters)
		onFiltersChange?.(nextFilters)
		updateSearchParam(name, value)
	}

	const typeOptions = [
		{ value: "", label: "All types" },
		...typenames.map((typeName) => ({
			value: typeName.toLowerCase(),
			label: typeName,
		})),
	]
	const generationOptions = [
		{ value: "", label: "All generations" },
		...Array.from({ length: TOTAL_GENERATIONS }, (_, index) => {
			const generation = String(index + 1)
			return { value: generation, label: generation }
		}),
	]

	return (
		<div className={styles.filters}>
			<label className={styles.control}>
				<span>Name</span>
				<input
					type="search"
					name="name"
					value={filters.name ?? ""}
					onChange={handleChange}
					placeholder="Search Pokemon"
				/>
			</label>

			<FilterDropdown
				name="type"
				label="Type"
				options={typeOptions}
				value={filters.type}
				onChange={handleDropdownChange}
			/>
			<FilterDropdown
				name="generation"
				label="Generation"
				options={generationOptions}
				value={filters.generation}
				onChange={handleDropdownChange}
			/>
		</div>
	)
}
