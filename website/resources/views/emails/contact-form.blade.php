<!DOCTYPE html>
<html lang="en">
    <body>
        <p>A user from the website has requested that you contact them.<p>

        <p><strong>Their details:</strong><p>

        <ul>
            <li><strong>Name: </strong>{{ $userName }}</li>
            <li><strong>Email: </strong>{{ $userEmail }}</li>
        </ul>

        <p><strong>Their message:<strong></p>

        <p><i>{{ $userMessage }}</i></p>
    </body>
</html>
