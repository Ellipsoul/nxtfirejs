import AuthCheck from "../../components/AuthCheck"

export default function AdminPostsPage(props) {
    return (
        <main>
            {/* AuthCheck component protects all admin features from unauthenticated users */}
            <AuthCheck>
                Admin Page
            </AuthCheck>
        </main>
    )
}
