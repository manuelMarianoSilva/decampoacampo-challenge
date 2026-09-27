import { useRef, useState } from "react"
import { useSearchParams } from "react-router"
import { TOTAL_GENERATIONS } from "../../utils/constants"
import { typenames } from "../typeBadges/typeIndex"
import styles from "./filters.module.css"

const readFilters = (searchParams) => ({
	name: searchParams.get("name") ?? "",
	type: searchParams.get("type") ?? "",
	generation: searchParams.get("generation") ?? "",
})

export const Filters = ({ onFiltersChange }) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [filters, setFilters] = useState(() => readFilters(searchParams))
	const filtersRef = useRef(filters)
	const searchParamsRef = useRef(searchParams)

	const handleChange = (event) => {
		const { name, value } = event.target
		const nextFilters = { ...filtersRef.current, [name]: value }
		const nextSearchParams = new URLSearchParams(searchParamsRef.current)

		if (value) {
			nextSearchParams.set(name, value)
		} else {
			nextSearchParams.delete(name)
		}

		filtersRef.current = nextFilters
		searchParamsRef.current = nextSearchParams
		setFilters(nextFilters)
		setSearchParams(nextSearchParams, { replace: true })
		onFiltersChange?.(nextFilters)
	}

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

			<label className={styles.control}>
				<span>Type</span>
				<select name="type" value={filters.type} onChange={handleChange}>
					<option value="">All types</option>
					{typenames.map((typeName) => (
						<option key={typeName} value={typeName.toLowerCase()}>
							{typeName}
						</option>
					))}
				</select>
			</label>

			<label className={styles.control}>
				<span>Generation</span>
				<select
					name="generation"
					value={filters.generation}
					onChange={handleChange}
				>
					<option value="">All generations</option>
					{Array.from({ length: TOTAL_GENERATIONS }, (_, index) => index + 1).map(
						(generation) => (
							<option key={generation} value={generation}>
								{generation}
							</option>
						),
					)}
				</select>
			</label>
		</div>
	)
}
