import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import App from "./App";
import { groupPostsByLocation } from "./Helper";

test("renders first week text", async () => {
  render(<App />);
  // initial category heading should be present
  await waitFor(() => {
    const weekText = screen.getByText(/Week 11, Year 2019/i);
    expect(weekText).toBeInTheDocument();
  });
});

test("three group options", () => {
  render(<App />);
  // three group options should be present
  expect(screen.getAllByRole("option").length).toBe(3);
});

test("default group state test", () => {
  render(<App />);
  // default selected group is week
  const select = screen.getByDisplayValue("Week");
  expect(select).toHaveClass("filter");
});

test("handleGroupChange updates the group state", () => {
  render(<App />);
  // group change should change the select field value
  const groupSelect = screen.getByTestId("filter") as HTMLSelectElement;
  fireEvent.change(groupSelect, { target: { value: "author" } });
  expect(groupSelect.value).toBe("author");
});

test("updates filtered posts on filter change", async () => {
  render(<App />);
  // change in grouping should change state and so the UI
  const groupSelect = screen.getByTestId("filter");
  // Change the group to 'location'
  fireEvent.change(groupSelect, { target: { value: "location" } });
  // Wait for the component to update based on group change
  await waitFor(() => {
    // identifiable text for location group
    const sanFranciscoGroup = screen.getAllByText("San Francisco");
    // heading should be present
    expect(sanFranciscoGroup[0]).toHaveClass("posts-title");
  });
});

test("groups posts by location correctly", () => {
    // Mock posts data
    const posts = [
        {
            id: 1,
            location: "San Francisco",
            time: "1552657573",
            author: "Happy User",
            text: "Proper PDF conversion ensures that every element of your document remains just as you left it.",
        },
        {
            id: 2,
            location: "San Francisco",
            time: "1552571173",
            author: "Happy User",
            text: "The modern workplace is increasingly digital, and workflows are constantly evolving.",
        }
    ];
    const grouped = groupPostsByLocation(posts);
    // make sure grouping works
    expect(grouped["San Francisco"]).toBeDefined();
    // Check if a specific location has the correct number of posts
    // 2 posts fall in 'San Francisco' based on mock data
    expect(grouped["San Francisco"].length).toBe(2);
});

test("renders posts based on filteredPosts", async () => {
  render(<App />);
  // posts renders properly
  await waitFor(() => {
    const postElement = screen.queryByText(
      "Digital transformation isn't just a buzzword"
    );
    expect(postElement).toBeInTheDocument();
  });
});

test("editing post works correctly", async () => {
  render(<App />);
  await waitFor(() => {
    const weekText = screen.getByText(/Week 11, Year 2019/i);
    expect(weekText).toBeInTheDocument();
  });
  // get all edit post buttons
  const editButtons = screen.getAllByAltText("edit post");
  // click the first button
  fireEvent.click(editButtons[0]);
  // get input fields
  const inputAuthor = screen.getByLabelText("Author");
  const inputLocation = screen.getByLabelText("Location");
  // change form values
  fireEvent.change(inputAuthor, { target: { value: "New Author" } });
  fireEvent.change(inputLocation, { target: { value: "New Location" } });
  // Find the submit button
  const submitButton = screen.getByTestId("submit");
  // Simulate form submission
  fireEvent.click(submitButton);

  // Wait for the component to update based on the filter change
  await waitFor(() => {
    const newAuthorElement = screen.getAllByText("New Author");
    // if state uppdated so UI must change
    expect(newAuthorElement).toHaveLength(1);
  });
});