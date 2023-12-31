import { useEffect, useState } from 'react'
import './App.scss'
import data from './posts.json'
import { post, filteredPosts, editPost } from './Types'
import { getWeekNumber, groupPostsByAuthor, groupPostsByLocation } from './Helper'

// default post value to make sure form input is controlled
const defaultPost = {
  key:'',
  index:0,
  post:{
    id: 0,
    location: '',
    time: '',
    author: '',
    text: ''
  }
}

/**
 * Main posts view
 * @returns 
 */
function App() {
  const [posts, setPosts] = useState<post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<filteredPosts>({})
  const [filter, setFilter] = useState<string>("week")
  const [edit, setEdit] = useState<boolean>(false)
  const [editPost, setEditPost] = useState<editPost>(defaultPost)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(()=>{
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const response = await fetch('http://localhost:3100/get-posts')
        const jsonData = await response.json();
        setPosts(jsonData);
      } catch (e) {
        console.log(`fetch error: ${(e as Error).message} therefore loading posts from a file`)
        setPosts(data)
      }
      setLoading(false)
    }
    fetchPosts()
  },[])

  useEffect(()=>{
    // function to group posts by week
    const groupPostsByWeek = (posts: post[]): Record<string, post[]> => {
      return posts.reduce((acc: Record<string, post[]>, post: post) => {
        const [year, week] = getWeekNumber(post.time);
        const weekStr = `Week ${week}, Year ${year}`;
        // Initialize the array for this author if it doesn't exist
        if (!acc[weekStr]) {
            acc[weekStr] = [];
        }
        // Add the post to the corresponding author
        acc[weekStr].push(post);
        return acc;
      }, {});
    }
    // set filtered posts
    switch (filter) {
      case 'location':
        setFilteredPosts(groupPostsByLocation(posts))
        break;
      case 'author':
        setFilteredPosts(groupPostsByAuthor(posts))
        break;
      default:
        setFilteredPosts(groupPostsByWeek(posts))
        break;
    }
  },[filter, posts])

  // handles change in filter value
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value)
  }

  // toggle post information
  const handlePostClick = (e: React.MouseEvent) => {
    e.currentTarget.classList.toggle('active');
  }

  // function to show edit form
  const handleEditClick = (e: React.MouseEvent, key: string, index: number, post:post) => {
    e.stopPropagation();
    setEdit(true);
    setEditPost({
      key: key,
      index: index,
      post: post
    })
  }

  // function to handle author change
  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEditPost({
      ...editPost,
      post: {
        ...editPost.post,
        author: e.target.value
      }
    })
  }

  // function to handle location change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEditPost({
      ...editPost,
      post: {
        ...editPost.post,
        location: e.target.value
      }
    })
  }

  // function to update posts and filtered posts
  const handleFormChange = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFilteredPosts = filteredPosts[editPost.key]
    updatedFilteredPosts[editPost.index] = {
      ...updatedFilteredPosts[editPost.index],
      author: editPost.post.author,
      location: editPost.post.location
    }
    const newPosts = posts.map((post:post)=>{
      if( post.id === editPost.post.id ) {
        return {
          ...editPost.post
        }
      } else {
        return post
      }
    })
    setFilteredPosts({
      ...filteredPosts,
      [editPost.key]: updatedFilteredPosts
    })
    setPosts(newPosts)
    setEdit(!edit);
  }

  // function to close post edit form
  const handleCloseClick = () => {
    setEdit(false)
  }

  return (
    <>
      <div className='filters'>
        Group by: 
        <select id="filter" className='filter' name="filter" onChange={handleFilterChange} value={filter} data-testid="filter">
          <option value="week">Week</option>
          <option value="location">Location</option>
          <option value="author">Author</option>
        </select>
      </div>
      <div className='posts-wrapper'>
        {
          Object.keys(filteredPosts).length > 0 && Object.keys(filteredPosts).map((key: string)=>{
            return <div className='posts-group active' key={key}>
              <h4 className='posts-title' onClick={(e: React.MouseEvent)=>{
                const target = e.target as HTMLElement
                target.parentElement?.classList.toggle('active')
              }}>{key} <img className="toggle" src="toggle.png" alt="group toggle" /></h4>
              <div className="posts">
                {
                  filteredPosts[key].map((post, idx)=>{
                    const dt = new Date(parseInt(post.time) * 1000)
                    return <div key={idx} className='post' onClick={handlePostClick}>
                      <h2 className='title'>{post.text}</h2>
                      <div className="meta-wrapper">
                        <div className="meta">
                          <div className="author">Author: <span>{post.author}</span></div>
                          <div className="location">Location: <span>{post.location}</span></div>
                          <div className="time">Posted on: {dt.toLocaleString()}</div>
                          <button className='editable' onClick={(e)=>handleEditClick(e, key, idx, post)}>
                            <img src='edit.png' alt="edit post" />
                          </button>
                        </div>
                      </div>
                    </div>
                  })
                }
              </div>
            </div>
          })
        }
        {
          ! Object.keys(filteredPosts).length ? <div>
            <h4>{ loading ? 'Loading posts...' : 'Posts not found'}</h4>
            <div className="posts">
              <div className='post'>There are no posts in the database yet.</div>
            </div>
          </div>
          :
          ''
        }
      </div>
      { edit && <div className="backdrop"></div> }
      <div className={`edit-form ${edit && 'active'}`}>
        <div className='form-title'>Edit Post (#{editPost?.post.id})</div>
        <form id="edit-post" name="edit-post" action="">
          <div>
            <label htmlFor="author">Author</label>
            <input type="text" value={editPost?.post.author} onChange={handleAuthorChange} name="author" id="author" />
          </div>
          <div>
            <label htmlFor="location">Location</label>
            <input type="text" value={editPost?.post.location} onChange={handleLocationChange} name="location" id="location" />
          </div>
          <input type="submit" value="Submit" name="submit" id="submit" data-testid="submit" onClick={handleFormChange} />
        </form>
        <button className='form-close' onClick={handleCloseClick}>
          <img src="close.png" alt="close" />
        </button>
      </div>
    </>
  )
}

export default App
