import { GoSearch } from 'react-icons/go';
import PropTypes from 'prop-types';

import {
  SearchbarHeader,
  Form,
  Button,
  ButtonLabel,
  Input,
} from './Searchbar.styled';

export default function Searchbar({ onSubmit }) {
  function onFormSubmit(e) {
    e.preventDefault();
    onSubmit(e.target.elements.inputValue.value.trim());
  }

  return (
    <SearchbarHeader>
      <Form onSubmit={onFormSubmit}>
        <Button type="submit">
          <GoSearch />
          <ButtonLabel>Search</ButtonLabel>
        </Button>

        <Input
          name="inputValue"
          type="text"
          autocomplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </Form>
    </SearchbarHeader>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
