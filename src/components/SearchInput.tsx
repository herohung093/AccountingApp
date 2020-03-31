import * as React from "react"
import { useState } from "react";
import { Form } from "react-bootstrap"
interface SearchInputProps {
    holderText: string;
    handleSearchChange: (value: string) => void;
}
const SearchInput: React.FC<SearchInputProps> = ({ holderText, handleSearchChange }) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const handleFormChange = (e: any) => {
        e.preventDefault();
        setSearchValue(e.target.value)
        handleSearchChange(searchValue)
    }

    return (
        <div>
            <Form autoComplete="off" onSubmit={(e: React.FormEvent) => { e.preventDefault() }}>
                <Form.Group>
                    <Form.Control
                        type="text"
                        placeholder={holderText}
                        name="searchInput"
                        onChange={handleFormChange}
                        value={searchValue}
                    />
                </Form.Group>
            </Form></div>
    );

}
export default SearchInput;