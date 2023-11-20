import { post } from './Types'

// function to group posts by location
export const groupPostsByLocation = (posts: post[]): Record<string, post[]> => {
    return posts.reduce((acc: Record<string, post[]>, post: post) => {
        // Initialize the array for this location if it doesn't exist
        if (!acc[post.location]) {
            acc[post.location] = [];
        }
        // Add the post to the corresponding location
        acc[post.location].push(post);
        return acc;
    }, {});
}

// function to group posts by author
export const groupPostsByAuthor = (posts: post[]): Record<string, post[]> => {
    return posts.reduce((acc: Record<string, post[]>, post: post) => {
        // Initialize the array for this author if it doesn't exist
        if (!acc[post.author]) {
            acc[post.author] = [];
        }
        // Add the post to the corresponding author
        acc[post.author].push(post);
        return acc;
    }, {});
  }

// helper function to convert 'time' field to a Date object and get the week number
export const getWeekNumber = (timestamp: string) => {
    let date = new Date(parseInt(timestamp) * 1000); // Convert Unix timestamp to milliseconds
    // Copy date so don't modify original
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    // Return array of year and week number
    return [date.getUTCFullYear(), weekNo];
}