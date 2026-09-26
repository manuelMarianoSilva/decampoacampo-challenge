import { typeIndex } from "../typeBadges/typeIndex";

export const TypeBadges = ({data}) => {
    const types = data?.types.map(type => type.type.url.match(/\/(\d+)\/?$/)[1]);

    return (
        <div style={{ display: "flex" }}>
            {types?.map((idx) => (
                typeIndex?.[idx].default
            ))}
        </div>
    )
}