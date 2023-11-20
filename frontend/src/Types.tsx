// Post type defintion
export type post = {
    id: number,
    location: string,
    time: string,
    author: string,
    text: string
}

// Filtered posts type definition
export type filteredPosts = {
    [key: string]: post[]
}

// Post type definition for the post being edited
export type editPost = {
    key: string,
    index: number,
    post: post
}