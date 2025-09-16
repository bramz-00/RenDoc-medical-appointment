import Header from "../components/layouts/Header"


const UserLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Header />
            <main className="p-6">
                {children}
            </main>
        </div>
    )
}

export default UserLayout