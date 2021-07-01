function [Irecad,Arecad,coinhautgauche] = recadrage(I,A)
trouvelignemin = false;
trouvelignemax = false;
trouvecolmin = false;
trouvecolmax = false;
[nblignes, nbcols,nbcan] = size(I);
for i = 1:nblignes
    for j = 1:nbcols
        
        if (~trouvelignemin && A(i,j)~=0)
            lignemin = i;
            trouvelignemin = true;
        end
        
        if (A(i,j)~=0)
        
            lignemax = i;
            
        end
        
    end

end

for j = 1:nbcols
    for i = 1:nblignes
        
        if (~trouvecolmin && A(i,j)~=0)
            colmin = j;
            trouvecolmin = true;
        end
        
        if (A(i,j) ~=0)
        
            colmax = j;
            
        end
        
    end

end


Irec = I(lignemin:lignemax,colmin:colmax,:);
Irecad = uint8(Irec);
Arecad = A(lignemin:lignemax,colmin:colmax);
coinhautgauche = [lignemin,colmin];