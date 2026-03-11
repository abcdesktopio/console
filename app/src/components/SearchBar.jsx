import React from "react";
import { Form } from "react-bootstrap";

export default function SearchBar({id, onChange, placeholder}) {
    return (
        <Form>
            <Form.Control
                id={id}
                type="text"
                onChange={onChange}
                placeholder={placeholder}
                className="me-2"
                aria-label="Search"
            />
        </Form>
    );
}